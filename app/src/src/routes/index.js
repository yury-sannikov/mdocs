'use strict';
const Router = require('koa-router');

const router = new Router();

router.use(require('./app').routes());

router.get('/health_check', function*() {
  this.body = { healthy: 1};
});

module.exports = router;
