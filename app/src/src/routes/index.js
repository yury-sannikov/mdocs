'use strict';
const Router = require('koa-router');

const router = new Router();

router.use(require('./app').routes());
router.use(require('./authentication').routes());
router.use(require('./survey').routes());
router.use(require('./user_hook').routes());

router.get('/', function*() {
  this.render('index', this.jadeLocals, true);
});

module.exports = router;
