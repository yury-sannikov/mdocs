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

function* insertOrUpdateUser(ctx) {
  yield db.insertOrUpdateUser(ctx.user.user_id,
    Object.assign({}, {
      id: ctx.user.user_id,
      auth0_user: ctx.user,
      last_request: ctx.context.request
    }));
}
