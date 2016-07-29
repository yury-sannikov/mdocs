'use strict';
const mw = require('../middleware');
const Router = require('koa-router');
const config = require('../config');


const router = new Router();

router.get('/health_check', function*() {
  this.body = { healthy: 1};
});

const APP_CSRF_SKIP_PREFIX = '/app/hooks';

const appRoutes = require('./app');

// Need session & body
appRoutes.use(mw.ensureReferer([config.APP_HOSTNAME], APP_CSRF_SKIP_PREFIX));

appRoutes.use(mw.checkJWTExpiration());

router.use(appRoutes.routes());


const sitebuilderRoutes = require('./sitebuilder/preview');

sitebuilderRoutes.use(mw.ensureReferer([config.APP_HOSTNAME, config.SITEBUILDER_HOSTNAME]));

appRoutes.use(mw.checkJWTExpiration());

router.use(sitebuilderRoutes.routes());


module.exports = router;
