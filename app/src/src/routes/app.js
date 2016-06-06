
'use strict';
const Router = require('koa-router');
import { checkAuthenticated } from '../belt';
import { sendEmailTrackingToSlack } from '../comm';
import stream from 'koa-stream';

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
  - locations
  - providers


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
  this.redirect('/');
});

router.get('/profile', checkAuthenticated, function() {
  this.render('app/profile', this.jadeLocals, true);
});

// Show Dashboard
router.get('dashboard', '/', checkAuthenticated, function*() {
  this.render('app/dashboard', this.jadeLocals, true);
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
  stream.buffer(this, new Buffer([1,2,3]), 'image/png', {allowDownload: true});
  sendEmailTrackingToSlack();
});

module.exports = router;
