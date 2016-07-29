'use strict';
const mw = require('../middleware');
const Router = require('koa-router');
const config = require('../config');
const csrf = require('koa-csrf');

const router = new Router();

router.get('/health_check', function*() {
  this.body = { healthy: 1};
});

const APP_CSRF_SKIP_PREFIX = '/app/hooks';
const SB_CSRF_SKIP_PREFIX = '/sitebuilderpreview/auth';

const appRoutes = require('./app');

// Need session & body
appRoutes.use(mw.ensureReferer([config.APP_HOSTNAME], APP_CSRF_SKIP_PREFIX));

appRoutes.use(mw.checkJWTExpiration());

appRoutes.use(csrf({
  middleware: mw.csrfMiddleware(APP_CSRF_SKIP_PREFIX)
}));

// Jade locals with csrf
appRoutes.use(mw.wrapJadeLocals());

router.use(appRoutes.routes());


const sitebuilderRoutes = require('./sitebuilder/preview');

sitebuilderRoutes.use(mw.ensureReferer([config.APP_HOSTNAME, config.SITEBUILDER_HOSTNAME]));

sitebuilderRoutes.use(mw.checkJWTExpiration());

sitebuilderRoutes.use(csrf({
  middleware: mw.csrfMiddleware(SB_CSRF_SKIP_PREFIX)
}));

// Jade locals with csrf
sitebuilderRoutes.use(mw.wrapJadeLocals());

router.use(sitebuilderRoutes.routes());


module.exports = router;
