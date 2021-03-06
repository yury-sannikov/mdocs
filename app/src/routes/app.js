
'use strict';
const Router = require('koa-router');
import { checkAuthenticated } from '../belt';
import { sendEmailTrackingToSlack, notifySubscriptionCancel } from '../comm';
import stream from 'koa-stream';
import { getFutureInvoice, cancelSubscriptions } from '../stripe';
import { render as dashboardRender } from '../apps/dashboard/server';
import { render as appointmentsRender } from '../apps/appointments/server';
import { render as campaignsRender } from '../apps/campaigns/server';
import prModule from './pr'
import { profileById } from '../db'
import _ from 'lodash'
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
  - PracticeWin
app/pr
  - profiles
*/




const router = new Router({
  prefix: '/app'
});


router.use(require('./hooks').routes());
router.use(require('./appointmentApi').routes());
router.use(require('./subscribe').routes());
router.use(require('./pr/survey').routes());
router.use(prModule.routes());
router.use(require('./sitebuilder').routes());

router.get('/login', function() {
  this.session.redirectOnLogin = this.query.r;
  this.render('app/login', this.jadeLocals, true);
});

router.get('/logout', function() {
  this.logout();
  this.redirect('http://www.practicewin.com');
});

router.get('/welcome', checkAuthenticated, function* () {
  this.render('app/welcome', this.jadeLocals, true);
});

router.get('/profile', checkAuthenticated, function* () {
  this.render('app/profile', this.jadeLocals, true);
});

router.get('/subscription', checkAuthenticated, function* () {
  const { stripeId } = this.currentUser  || {}

  if (!stripeId || stripeId.length === 0) {
    this.flash = 'Stripe ID is not set. Subscription information is not available'
    this.redirect(router.url('dashboard'))
    return
  }
  const ERROR_MESSAGES = {
    StripeInvalidRequestError: 'Unable to get subscription information.',
    default: 'No invoice information.'
  }
  let futureInvoice
  try {
    futureInvoice = yield getFutureInvoice(this.currentUser.id, this.currentUser.account.profiles);
  }
  catch(e) {
    console.dir(e)
    this.render('app/empty', Object.assign({}, this.jadeLocals, {
      flash: ERROR_MESSAGES[e.type] || ERROR_MESSAGES.default
    }), true);
    return
  }
  const { currentInvoice, upcomingInvoice, currentSubscription } = futureInvoice

  const currentInvoiceData = currentInvoice.data[0] || {}
  const currentInvoiceLine = currentInvoiceData.lines.data[0] || {}


  const paymentDelta = upcomingInvoice.lines.data
    .filter((i) => i.type === 'invoiceitem')
    .reduce((sum, item) => {return sum + item.amount}, 0.0)

  this.render('app/subscription', Object.assign({}, this.jadeLocals, {
    futureInvoice: upcomingInvoice,
    currentInvoice: currentInvoiceData,
    currentInvoiceLine,
    currentSubscription,
    paymentDelta
  }), true);
});

// Show Dashboard
router.get('dashboard', '/', checkAuthenticated, function*() {
  this.redirect('app/welcome', this.jadeLocals, true);
});

router.get('dashboardNew', '/dashboard*', checkAuthenticated, function*() {
  yield dashboardRender(this, this.jadeLocals);
});

router.get('appointments', '/appointments*', checkAuthenticated, function*() {
  yield appointmentsRender(this, this.jadeLocals);
});

router.get('appointments', '/campaigns*', checkAuthenticated, function*() {
  yield campaignsRender(this, this.jadeLocals);
});

router.get('analytics', '/analytics/:id', checkAuthenticated, function*() {
  const profile = yield profileById(this.params.id)
  const dashboardUrl = _.get(profile, '[0][0].analytics.dashboardUrl', null)
  this.render('analytics/main',
    Object.assign({}, this.jadeLocals, { dashboardUrl }), true);
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
