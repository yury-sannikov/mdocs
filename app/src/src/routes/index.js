'use strict';
const mw = require('../middleware');
const Router = require('koa-router');

const router = new Router();

router.get('/health_check', function*() {
  this.body = { healthy: 1};
});

const appRoutes = require('./app');

// Need session & body
appRoutes.use(mw.ensureReferer());

appRoutes.use(mw.checkJWTExpiration());

router.use(appRoutes.routes());


module.exports = router;
