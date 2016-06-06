'use strict';

const db = require('../db');
const Router = require('koa-router');
const debug = require('debug')('app:routes:user_hook');
import passport from 'koa-passport';
import { findUserById } from '../db';

const router = new Router({
  prefix: '/hooks'
});

router.post('/auth0', function*() {
  yield insertOrUpdateUser(this.request.body);
  this.body = { ok: 1};
});

router.get('/login', loginCallbackHandler);

function* loginCallbackHandler() {
  var ctx = this;
  const redirectOnLogin = this.session.redirectOnLogin;
  const redirectTo = redirectOnLogin ? decodeURIComponent(redirectOnLogin) : '/app';
  ctx.session.redirectOnLogin = null;
  console.log(`Redirect to ${redirectTo}`);
  yield passport.authenticate('auth0', function*(err, user, info) {
    if (err) throw err;

    if (user === false) {
      ctx.redirect('/');
    } else {
      yield ctx.login(user);

      const dbUser = yield findUserById(user.id);

      ctx.session.hasSubscription = !!dbUser.stripeCustomer;
      ctx.response.redirect(redirectTo);
    }
  });
}


module.exports = router;

function* insertOrUpdateUser(ctx) {
  yield db.insertOrUpdateUser(ctx.user.user_id,
    Object.assign({}, {
      id: ctx.user.user_id,
      email: ctx.user.email,
      auth0_user: ctx.user,
      last_request: ctx.context.request
    }));
}
