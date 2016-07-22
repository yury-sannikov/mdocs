
'use strict';
const Router = require('koa-router');
import { checkAuthenticated, hasSubscription } from '../belt';
import { sendEmailTrackingToSlack } from '../comm';
import stream from 'koa-stream';
import { getFutureInvoice, cancelSubscriptions, updateSessionSubscriptionInfo } from '../stripe';
import { render as dashboardRender } from '../apps/dashboard/server';
/*
app:
  - login
  - logout
  - (*)profile
app/hooks
  - login
  - auth0
app/subscribe
  - subscribe
  - pricing
app/pr/phi: (HIPAA)
  - patient reviews
app/pr
  - profiles
*/




const router = new Router({
  prefix: '/app'
});

router.use(require('./hooks').routes());
router.use(require('./subscribe').routes());
router.use(require('./pr/survey').routes());
router.use(require('./pr').routes());

router.get('/login', function() {
  this.session.redirectOnLogin = this.query.r;
  this.render('app/login', this.jadeLocals, true);
});

router.get('/logout', function() {
  this.logout();
  this.redirect('https://pr.mdocs.co');
});

router.get('/welcome', checkAuthenticated, function* () {
  this.render('app/welcome', this.jadeLocals, true);
});

router.get('/profile', checkAuthenticated, function* () {
  this.render('app/profile', this.jadeLocals, true);
});

router.get('/subscription', checkAuthenticated, hasSubscription, function* () {
  const futureInvoice = yield getFutureInvoice(this.currentUser.id);
  this.render('app/subscription', Object.assign({}, this.jadeLocals, {
    futureInvoice
  }), true);
});

router.post('/delete-subscription', checkAuthenticated, function* () {
  yield cancelSubscriptions(this.currentUser.id);
  yield updateSessionSubscriptionInfo(this, this.currentUser.id);
  this.flash = 'Your subscribtion has been canceled';
  this.redirect('/app');
});

// Show Dashboard
router.get('dashboard', '/', checkAuthenticated, function*() {
  this.render('app/welcome', this.jadeLocals, true);
});

router.get('dashboardNew', '/dashboard*', checkAuthenticated, function*() {
  yield dashboardRender(this, this.jadeLocals);
});

// Show Help
router.get('/help', function*() {
  this.render('legal/help', this.jadeLocals, true);
});

// Show Terms of Use
router.get('/terms', function*() {
  this.render('legal/terms', this.jadeLocals, true);
});

// Show Privacy Policy
router.get('/privacy', function*() {
  this.render('legal/privacy', this.jadeLocals, true);
});

// Show Agreement
router.get('/agreement', function*() {
  this.render('legal/agreement', this.jadeLocals, true);
});

router.get('/email-tracking', function*() {
  yield sendEmailTrackingToSlack(this.request.query);
  var buf = new Buffer([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00,
    0x80, 0x00, 0x00, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x2c,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x02,
    0x02, 0x44, 0x01, 0x00, 0x3b]);
  stream.buffer(this, buf, 'image/png', {allowDownload: true});
});

module.exports = router;
