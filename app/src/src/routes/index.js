'use strict';
const mw = require('../middleware');
const Router = require('koa-router');
const config = require('../config');


const router = new Router();

router.get('/health_check', function*() {
  this.body = { healthy: 1};
});

const appRoutes = require('./app');
router.use(appRoutes.routes());


const sitebuilderRoutes = require('./sitebuilder/preview');
router.use(sitebuilderRoutes.routes());


module.exports = router;
