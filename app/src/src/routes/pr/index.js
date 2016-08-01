'use strict';
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');
const db = require('../../db');
const communicator = require('../../comm');
import { checkAuthenticated, hasSubscription } from '../../belt';
import { getFutureInvoice, updateSubscription } from '../../stripe';


const HARDCODED_QUESTIONS = {
  '0': 'Overall Satisfaction',
  '1': 'Staff',
  '2': 'Dr. Mary Mayer, MD'
};

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data[0]) && data[0].length > 0;
}

const router = new Router({
  prefix: '/pr'
});

router.use(checkAuthenticated);

const phi = require('./phi');
router.use(phi.routes());

router.get('/', function*() {
  this.redirect(phi.url('patient-reviews'));
});

// Show profiles
router.get('profiles', '/profiles', function*() {
  const data = yield db.profilesForAdmin(this.currentUser.id);
  this.render('settings/profiles', Object.assign({}, this.jadeLocals, { profiles: data[0] }), true);
});

router.get('/profile/:id', function*() {
  const data = yield db.profileById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect(router.url('profiles'));
    return;
  }
  this.render('settings/profileDetail', Object.assign({}, this.jadeLocals, { profile: data[0][0] }), true);
});

router.get('/new-profile', checkAuthenticated, hasSubscription, function*() {
  const {currentInvoice, upcomingInvoice, currentSubscription} = yield getFutureInvoice(this.currentUser.id);
  
  this.render('settings/createEditProfile', Object.assign({}, this.jadeLocals, { 
    profile: '',
    futureInvoice: upcomingInvoice,
    currentSubscription
  }), true);
});

router.get('/update-profile/:id', function*() {
  const data = yield db.profileById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect(router.url('profiles'));
    return;
  }
  this.render('settings/createEditProfile', Object.assign({}, this.jadeLocals, { profile: data[0][0] }), true);
});

router.post('/new-profile', hasSubscription, function*() {
  const profile = Object.assign({}, this.request.body);
  const id = yield db.createProfile()(this.currentUser.id, profile);
  yield updateSubscription(this.currentUser.id, this.session);
  this.redirect(router.url('profiles'));
});

router.post('/update-profile', hasSubscription, function*() {
  const profile = Object.assign({}, this.request.body);
  const id = yield db.updateProfile(this.request.body.editID, profile);
  this.redirect(router.url('profiles'));
});

router.post('/delete-profile', hasSubscription, function*() {
  yield db.deleteProfile(this.request.body.id);
  this.flash = 'Profile deleted successfully.';
  yield updateSubscription(this.currentUser.id, this.session);
  this.redirect(router.url('profiles'));
});

module.exports = router;
