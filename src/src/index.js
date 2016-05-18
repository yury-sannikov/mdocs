'use strict';

// 3rd party
require('dotenv').config(); // Load env vars from .env, always run this early
const Koa = require('koa');
const bouncer = require('koa-bouncer');
const Pug = require('koa-pug');
const debug = require('debug')('app:index');
const csrf = require('koa-csrf');
// 1st party
const config = require('./config');
const mw = require('./middleware');
const belt = require('./belt');
const cancan = require('./cancan');

////////////////////////////////////////////////////////////

const app = new Koa();
app.poweredBy = false;
app.proxy = config.TRUST_PROXY;

////////////////////////////////////////////////////////////
// Configure view-layer (nunjucks)
//
// We can override options send directly to nunjucks.
// https://mozilla.github.io/nunjucks/api.html#configure
////////////////////////////////////////////////////////////

const pug = new Pug({
  viewPath: './views',
  debug: false,
  pretty: false,
  compileDebug: false,
  locals: {
    moment: require('moment'),
    application: 'MDOCS',
    formatPhone: belt.formatPhone,
    _: require('lodash')
  },
  basedir: './views',
  helperPath: [
  ]
});

/*
const nunjucksOptions = {
  // `yield this.render('show_user')` will assume that a show_user.html exists
  ext: '.html',
  noCache: config.NODE_ENV === 'development',
  // don't throw template errors in development if we try to render
  // a null/undefined like {{ x }}. in theory, setting it to true prevents
  // bugs and forces you to be explicit about {{ x or '' }}, but in reality,
  // often more annoying than it's worth.
  throwOnUndefined: false,
  // globals are bindings we want to expose to all templates
  globals: {
    // let us use `can(USER, ACTION, TARGET)` authorization-checks in templates
    can: cancan.can,
  },
  // filters are functions that we can pipe values to from nunjucks templates.
  // e.g. {{ user.uname | md5 | toAvatarUrl }}
  filters: {
    json: x => JSON.stringify(x, null, '  '),
    formatDate: belt.formatDate,
    nl2br: belt.nl2br,
    md5: belt.md5,
    toAvatarUrl: belt.toAvatarUrl,
    autolink: belt.autolink,
  },
};
*/

////////////////////////////////////////////////////////////
// Middleware
////////////////////////////////////////////////////////////

app.use(require('koa-helmet')());
app.use(require('koa-compress')());
app.use(require('koa-static')('public', {
  maxage: 1000 * 60 * 15,
  gzip: true
}));
// Don't show logger in test mode
if (config.NODE_ENV !== 'test') {
  app.use(require('koa-logger')());
}
app.use(require('koa-body')({ multipart: true, jsonLimit: '5mb' }));
app.use(mw.methodOverride());  // Must come after body parser
app.use(mw.removeTrailingSlash());
app.use(mw.wrapCurrUser());
app.use(mw.wrapFlash('flash'));
app.use(mw.wrapExceptions());
app.use(bouncer.middleware());
app.use(mw.handleBouncerValidationError()); // Must come after bouncer.middleware()
//app.use(nunjucksRender('views', nunjucksOptions));
app.use(pug.middleware);

// sessions
const session = require('koa-session');
app.keys = ['4d92163b86ad469c8861a4e0d399a524-app-mdocs-co'];
app.use(session(app));

// csrf
app.use(csrf());

// Need session & body
app.use(mw.ensureReferer());

// Jade locals with csrf
app.use(mw.wrapJadeLocals());


// authentication
require('./auth');
const passport = require('koa-passport');
app.use(passport.initialize());
app.use(passport.session());

// Provide a convience function for protecting our routes behind
// our authorization rules. If authorization check fails, 404 response.
//
// Usage:
//
//    router.get('/topics/:id', function*() {
//      const topic = yield db.getTopicById(this.params.id);
//      this.assertAuthorized(this.currUser, 'READ_TOPIC', topic);
//      ...
//    });
app.use(function*(next) {
  this.assertAuthorized = (user, action, target) => {
    const isAuthorized = cancan.can(user, action, target);
    const uname = (user && user.uname) || '<Guest>';
    debug('[assertAuthorized] Can %s %s: %s', uname, action, isAuthorized);
    this.assert(isAuthorized, 404);
  };
  yield* next;
});

////////////////////////////////////////////////////////////
// Routes
////////////////////////////////////////////////////////////

app.use(require('./routes').routes());
app.use(require('./routes/authentication').routes());
app.use(require('./routes/survey').routes());
app.use(require('./routes/user_hook').routes());

////////////////////////////////////////////////////////////

// If we run this file directly (npm start, npm run start-dev, node src/index.js)
// then start the server. Else, if we require() this file (like from
// our tests), then don't start the server and instead just export the app.
if (require.main === module) {
  app.listen(config.PORT, function() {
    console.log('Listening on port', config.PORT);
  });
} else {
  module.exports = app;
}
