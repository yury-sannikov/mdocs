'use strict';
const Router = require('koa-router');

const router = new Router({
  prefix: '/'
});

router.get('/', function*() {
  this.render('index', this.jadeLocals, true);
});


module.exports = router;
