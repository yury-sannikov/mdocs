'use strict';

// Node
const nodeUrl = require('url');
// 3rd
const debug = require('debug')('app:middleware');
const bouncer = require('koa-bouncer');
const _ = require('lodash');
const recaptcha = require('recaptcha-validator');
const csrf = require('koa-csrf');
// 1st
//const db = require('./db');
const config = require('./config');
const comm = require('./comm');

const CSRF_SKIP_PREFIX='/hooks';

// set currentUser to user object from passport object from session
exports.wrapCurrUser = function() {
  return function *(next) {
    if (!this.session || !this.session.passport) return yield next;

    if (this.session.passport.user) {
      this.currentUser = this.session.passport.user;
      debug('[wrapCurrUser] User found');
    } else {
      debug('[wrapCurrUser] No user found');
    }
    yield* next;
  };
};

// Expose jadeLocals to context
exports.wrapJadeLocals = function() {
  return function *(next) {
    const currentUser = this.currentUser || {};
    const { hasSubscription } = this.session || {};
    this.jadeLocals = {
      csrf: this.csrf,
      _csrf: this.csrf,
      auth0Token: currentUser.jwtToken,
      user: currentUser,
      messages: {},
      error: {},
      flash: this.flash,
      config: config,
      hasSubscription
    };

    yield* next;
  };
};

// Wrap exceptions
exports.wrapExceptions = function() {
  return function *(next) {
    try {
      yield* next;
    } catch(err) {
      const production = config.NODE_ENV === 'production';
      if (production) {
        yield comm.sendExceptionToSlack(err, this);
      }
      this.render('error/500', Object.assign({}, this.jadeLocals, {
        error: production ? {message : 'Internal Error'} : err
      }), true);
      this.status = 500;
    }
  };
};


// Expose req.flash (getter) and res.flash = _ (setter)
// Flash data persists in user's sessions until the next ~successful response
exports.wrapFlash = function(cookieName) {
  cookieName = cookieName || 'flash';

  return function *(next) {
    let data, tmp;
    if (this.cookies.get(cookieName)) {
      tmp = decodeURIComponent(this.cookies.get(cookieName));
      // Handle bad JSON in the cookie, possibly set by fuzzers
      try {
        data = JSON.parse(tmp);
      } catch(err) {
        this.cookies.set(cookieName, null);
        data = {};
      }
    } else {
      data = {};
    }

    Object.defineProperty(this, 'flash', {
      enumerable: true,
      get: function() {
        return data;
      },
      set: function(val) {
        const encodedVal = encodeURIComponent(JSON.stringify(val));
        this.cookies.set(cookieName, encodedVal, {
          // flash cookie only lasts 10 seconds to prevent stale flash messages.
          // CAVEAT: if the redirect request takes more than 10 seconds to
          // load, then the user will end up with no flash message,
          // no errors, etc.
          maxAge: 10000,
        });
      }
    });

    yield* next;

    // clear flash cookie if it's a successful request
    // AND if it was actually set (instead of sending extraneous set-cookie
    // on every request)
    if (this.response.status < 300 && this.cookies.get(cookieName) !== undefined) {
      this.cookies.set(cookieName, null);
    }
  };
};

exports.methodOverride = function() {
  return function*(next) {
    if (_.isUndefined(this.request.body))
      throw new Error('methodOverride middleware must be applied after the body is parsed and this.request.body is populated');

    if (this.request.body && this.request.body._method) {
      this.method = this.request.body._method.toUpperCase();
      delete this.request.body._method;
    }

    yield* next;
  };
};

exports.removeTrailingSlash = function() {
  return function*(next) {
    if (this.path.length > 1 && this.path.endsWith('/')) {
      this.redirect(this.path.slice(0, this.path.length-1));
      return;
    }

    yield* next;
  };
};

exports.handleBouncerValidationError = function() {
  return function*(next) {
    try {
      yield* next;
    } catch(err) {
      if (err instanceof bouncer.ValidationError) {
        console.warn('Caught validation error:', err, err.stack);
        this.flash = {
          message: ['danger', err.message || 'Validation error'],
          // CAVEAT: Max cookie size is 4096 bytes. If the user sent us a
          // body that exceeds that (for example, a large message), then
          // the cookie will not get set (silently).
          // TODO: Consider using localStorage to persist request bodies
          // so that it scales.
          params: this.request.body,
          bouncer: err.bouncer
        };
        this.redirect('back');
        return;
      }

      throw err;
    }
  };
};

exports.ensureRecaptcha = function*(next) {
  if (_.includes(['development', 'test'], config.NODE_ENV) && !this.request.body['g-recaptcha-response']) {
    console.log('Development mode, so skipping recaptcha check');
    yield* next;
    return;
  }

  if (!config.RECAPTCHA_SYSTEM_ONLINE) {
    console.warn('Warn: Recaptcha environment variables not set, so skipping recaptcha check');
    yield* next;
    return;
  }

  this.validateBody('g-recaptcha-response')
    .required('You must attempt the human test')
    .isString()
    .checkPred(s => s.length > 0, 'You must attempt the human test');

  try {
    yield recaptcha.promise(config.RECAPTCHA_SITESECRET, this.vals['g-recaptcha-response'], this.request.ip);
  } catch (err) {
    console.warn('Got invalid captcha: ', this.vals['g-recaptcha-response'], err);
    this.validateBody('g-recaptcha-response')
      .check(false, 'Could not verify recaptcha was correct');
    return;
  }

  yield* next;
};

// Cheap but simple way to protect against CSRF attacks
// TODO: Replace with something more versatile
exports.ensureReferer = function() {
  return function*(next) {
    // Don't ensure referer in tests

    // Skip get requests
    if (_.includes(['GET', 'HEAD', 'OPTIONS'], this.method)) {
      yield* next;
      return;
    }

    // Skip if no HOSTNAME is set
    if (!config.APP_HOSTNAME) {
      debug('Skipping referer check since APP_HOSTNAME not provided');
      yield* next;
      return;
    }

    if (this.request.url.indexOf(CSRF_SKIP_PREFIX) === 0) {
      yield* next;
      return;
    }

    const refererHostname = nodeUrl.parse(this.headers.referer || '').hostname;

    if (config.APP_HOSTNAME === refererHostname) {
      yield* next;
      return;
    }

    this.body = 'Invalid referer';
    this.status = 403;
  };
};

// THIS IS A HACK!
exports.csrfMiddleware = function() {
  return function*(next) {
    if (this.request.url.indexOf(CSRF_SKIP_PREFIX) == 0) {
      return yield next;
    }

    if (this.method === 'GET'
      || this.method === 'HEAD'
      || this.method === 'OPTIONS') {
      return yield* next;
    }

    try {
      this.assertCSRF(this.request.body);
    }
    catch(e) {
      this.body = 'csrf error';
      return;
    }

    yield* next;
  };
};
