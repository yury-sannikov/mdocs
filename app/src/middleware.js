'use strict';

// Node
const nodeUrl = require('url');
// 3rd
const debug = require('debug')('app:middleware');
const bouncer = require('koa-bouncer');
const _ = require('lodash');
const recaptcha = require('recaptcha-validator');
const csrf = require('koa-csrf');
const config = require('./config');
const comm = require('./comm');
import jwt from 'jsonwebtoken';
import { redirectToLogin } from './belt';
import { findAccountById } from './db'

exports.checkJWTExpiration = function() {
  return function*(next){
    const { passport : {user: { jwtToken } = {} } = {} } = this.session || {};
    if (!jwtToken) return yield next;
    const jwtObject = jwt.decode(jwtToken);
    const expireAt = new Date(jwtObject.exp * 1000);
    const now = new Date();
    if (expireAt > now) {
      return yield next;
    }
    debug('JWT session expired. Logging out');
    this.logout();
    redirectToLogin(this);
  };
};

// set currentUser to user object from passport object from session
exports.wrapCurrUser = function() {
  return function *(next) {
    if (!this.session || !this.session.passport) return yield next;

    if (this.session.passport.user) {
      this.currentUser = this.session.passport.user;
    }
    yield* next;
  };
};


// Expose jadeLocals to context
exports.wrapJadeLocals = function() {
  return function *(next) {
    const currentUser = this.currentUser || {};

    const { rights: accountRights = {} } = currentUser.account || {};
    const { sitebuilder: accountSitebuilder = {} } = currentUser.account || {};

    const sitebuilderSites = accountRights.sitebuilder &&
      accountSitebuilder.enabled &&
      Object.keys(accountSitebuilder.ids).map( k => ({ id: k, name:  accountSitebuilder.ids[k]}))

    this.jadeLocals = {
      csrf: this.csrf,
      _csrf: this.csrf,
      auth0Token: currentUser.jwtToken,
      user: currentUser,
      messages: {},
      error: {},
      flash: this.flash,
      config: config,
      sitebuilderSites,
      accountRights,
      hasStripeId: !!currentUser.stripeId
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
    debug('Development mode, so skipping recaptcha check');
    yield* next;
    return;
  }

  if (!config.RECAPTCHA_SYSTEM_ONLINE) {
    debug('Warn: Recaptcha environment variables not set, so skipping recaptcha check');
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
exports.ensureReferer = function(hostname, skipFor) {
  hostname = _.compact(hostname)
  return function*(next) {
    // Don't ensure referer in tests

    // Skip get requests
    if (_.includes(['GET', 'HEAD', 'OPTIONS'], this.method)) {
      yield* next;
      return;
    }

    // Skip if no HOSTNAME is set
    if (!_.isArray(hostname) || _.isEmpty(hostname)) {
      debug('Skipping referer check since *HOSTNAME is not provided');
      yield* next;
      return;
    }

    if (_.isArray(skipFor) && !_.isEmpty(skipFor)) {
      const findResult = skipFor.find((skipPath) => {
        return this.request.url.indexOf(skipPath) === 0
      })

      if (findResult) {
        yield* next;
        return;
      }
    }

    const refererHostname = nodeUrl.parse(this.headers.referer || '').hostname;

    if (hostname.indexOf(refererHostname) !== -1) {
      yield* next;
      return;
    }

    this.body = 'Invalid referer';
    this.status = 403;
  };
};

exports.csrfMiddleware = function(skipPrefixes = []) {
  return function*(next) {

    if (skipPrefixes.find( (prefix) => this.request.url.indexOf(prefix) === 0)) {
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
