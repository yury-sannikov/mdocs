'use strict';
// 3rd party
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');

// 1st party
// const db = require('../db');
// const communicator = require('../comm');

const router = new Router({
  prefix: '/subscribe'
});

////////////////////////////////////////////////////////////
// Check for authentification for all routes below
router.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect(`/login?r=${encodeURIComponent(this.request.url)}`);
  }
});

router.get('/', function*() {
  this.render('subscribe/plans', this.jadeLocals, true);
});

module.exports = router;
