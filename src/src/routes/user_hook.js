'use strict';

const db = require('../db');
const Router = require('koa-router');

const router = new Router({
  prefix: '/user-hook'
});

router.post('/auth0', function*() {
  yield insertOrUpdateUser(this.request.body);
});


module.exports = router;

function* insertOrUpdateUser(user) {
  console.log(JSON.stringify(user, null, 2));
  //createOrUpdateUser
}
