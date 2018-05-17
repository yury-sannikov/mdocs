'use strict';

const db = require('../db');
const Router = require('koa-router');
const debug = require('debug')('app:routes:user_hook');
import passport from 'koa-passport';
import { findUserById } from '../db';
import { sendStripeCallbackToSlack } from '../comm';

const router = new Router({
  prefix: '/hooks'
});

router.post('/auth0', function*() {
  yield insertOrUpdateUser(this.request.body);
  this.body = { ok: 1};
});

router.post('/stripe', function*() {
  yield sendStripeCallbackToSlack(this.request.body);
  this.body = { ok: 1};
});

router.get('/login', loginCallbackHandler);

function* loginCallbackHandler() {
  var ctx = this;
  const redirectOnLogin = this.session.redirectOnLogin;
  const redirectTo = redirectOnLogin ? decodeURIComponent(redirectOnLogin) : '/app';
  ctx.session.redirectOnLogin = null;
  yield passport.authenticate('auth0', function*(err, user, info) {
    if (err) throw err;
    if (user === false) {
      ctx.redirect('/');
    } else {
      yield ctx.login(user);

      const showWelcome = false; //TODO: check if we need it anymore

      ctx.response.redirect(redirectTo + ( showWelcome ? '?welcome=y' : '') );
    }
  });
}


module.exports = router;

function* insertOrUpdateUser(ctx) {
  const DEFAULT_QUESTIONS = {
    '0': 'Overall Satisfaction',
    '1': 'Staff',
    '2': 'Personal Doctor'
  };

  yield db.insertOrUpdateUser(ctx.user.user_id,
    Object.assign({}, {
      id: ctx.user.user_id,
      email: ctx.user.email,
      auth0_user: ctx.user,
      last_request: ctx.context.request,
      questions: DEFAULT_QUESTIONS
    }));
}
