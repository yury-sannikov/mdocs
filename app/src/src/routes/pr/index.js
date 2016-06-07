'use strict';
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');
const db = require('../../db');
const communicator = require('../../comm');
import { checkAuthenticated, hasSubscription } from '../../belt';
import { updateSubscription } from '../../stripe';


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

// Show providers
router.get('providers', '/providers', function*() {
  const data = yield db.providersForAdmin(this.currentUser.id);
  this.render('settings/providers', Object.assign({}, this.jadeLocals, {providers: data[0]}), true);
});

router.get('/provider/:id', function*() {
  const data = yield db.providerById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect(router.url('providers'));
    return;
  }
  this.render('settings/providerDetail', Object.assign({}, this.jadeLocals, { provider: data[0][0] }), true);
});

router.post('/new-provider', hasSubscription, function*() {
  console.log(this.request.body);

  const provider = Object.assign({}, this.request.body);
  const id = yield db.createProvider()(this.currentUser.id, provider);
  yield updateSubscription(this.currentUser.id, this.session);
  this.redirect(router.url('providers'));
});

router.post('/update-provider', hasSubscription, function*() {
  console.log(this.request.body);

  const provider = Object.assign({}, this.request.body);
  const id = yield db.updateProvider(this.request.body.editID, provider);

  this.redirect(router.url('providers'));
});

router.post('/delete-provider', hasSubscription, function*() {
  yield db.deleteProvider(this.request.body.id);
  this.flash = 'Provider deleted successfully.';
  yield updateSubscription(this.currentUser.id, this.session);
  this.redirect(router.url('providers'));
});

// Show office locations
router.get('locations', '/locations', function*() {
  const data = yield db.locationsForAdmin(this.currentUser.id);
  this.render('settings/locations', Object.assign({}, this.jadeLocals, {locations: data[0]}), true);
});

router.get('/location/:id', function*() {
  const data = yield db.locationById(this.params.id);
  console.log(this.params.id)
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect(router.url('locations'));
    return;
  }
  this.render('settings/locationDetail', Object.assign({}, this.jadeLocals, { location: data[0][0] }), true);
});

router.post('/new-location', hasSubscription, function*() {
  console.log(this.request.body);

  const location = Object.assign({}, this.request.body);
  const id = yield db.createLocation()(this.currentUser.id, location);
  yield updateSubscription(this.currentUser.id, this.session);

  this.redirect(router.url('locations'));
});

router.post('/update-location', hasSubscription, function*() {
  console.log(this.request.body);

  const location = Object.assign({}, this.request.body);
  const id = yield db.updateLocation(this.request.body.editID, location);

  this.redirect(router.url('locations'));
});

router.post('/delete-location', hasSubscription, function*() {
  yield db.deleteLocation(this.request.body.id);
  this.flash = 'Location deleted successfully.';
  yield updateSubscription(this.currentUser.id, this.session);
  this.redirect(router.url('locations'));
});

module.exports = router;
