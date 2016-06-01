'use strict';
var passport = require('koa-passport');
import { findUserById } from '../db';
const Router = require('koa-router');
const router = new Router();


const SUBSCRIBE_URL = '/subscribe/pricing';

// router.get('/callback', passport.authenticate('auth0', {
//   successRedirect: '/app',
//   failureRedirect: '/'
// }));
router.get('/callback', loginCallbackHandler);


router.get('/logout', function() {
  this.logout();
  this.redirect('/');
});

router.get('/login', function() {
  this.session.redirectOnLogin = this.query.r;
  this.render('app/login', this.jadeLocals, true);
});

router.get('/profile', function() {
  this.render('app/profile', this.jadeLocals, true);
});

module.exports = router;

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
