'use strict';

const db = require('../db');
const Router = require('koa-router');
const debug = require('debug')('app:routes:user_hook');

const router = new Router({
  prefix: '/user-hook'
});

router.post('/auth0', function*() {
  yield insertOrUpdateUser(this.request.body);
  this.body = { ok: 1};
});


module.exports = router;

function* insertOrUpdateUser(user) {
  console.log(JSON.stringify(user, null, 2));
  //createOrUpdateUser
}
