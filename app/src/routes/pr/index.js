'use strict';
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');
const db = require('../../db');
const communicator = require('../../comm');
import { checkAuthenticated, hasSubscription } from '../../belt';
import { getFutureInvoice } from '../../stripe';

export const KNOWN_SITES = {
  yelp: {
    name: 'Yelp',
    icon128: '/app/img/psl/yelp.png',
    icon128x2: '/app/img/psl/yelp@2x.png'
  },
  google: {
    name: 'Google Plus',
    icon128: '/app/img/psl/yelp.png',
    icon128x2: '/app/img/psl/yelp@2x.png'
  },
  healthgrades: {
    name: 'HealthGrades.com',
    icon128: '/app/img/psl/hg.png',
    icon128x2: '/app/img/psl/hg@2x.png'
  },
  vitals: {
    name: 'Vitals.com',
    icon128: '/app/img/psl/vitals.png',
    icon128x2: '/app/img/psl/vitals@2x.png'
  },
  ratemds: {
    name: 'RateMDs.com',
    icon128: '/app/img/psl/yelp.png',
    icon128x2: '/app/img/psl/yelp@2x.png'
  },
  yellowpages: {
    name: 'YellowPages',
    icon128: '/app/img/psl/yelp.png',
    icon128x2: '/app/img/psl/yelp@2x.png'
  },
  fb: {
    name: 'Facebook',
    icon128: '/app/img/psl/fb.png',
    icon128x2: '/app/img/psl/fb@2x.png'
  }
}

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
    isNewProfile: true,
    profile: {
      knownSites: KNOWN_SITES,
      review_sites: {}
    },
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
  const profile = Object.assign({
    review_sites_onsurvey: {}
  }, data[0][0], {
    knownSites: KNOWN_SITES,
  })
  this.render('settings/createEditProfile', Object.assign({}, this.jadeLocals, { profile }), true);
});

router.post('/new-profile', hasSubscription, function*() {
  const {currentInvoice, upcomingInvoice, currentSubscription} = yield getFutureInvoice(this.currentUser.id);
  const data = {
    futureInvoice: upcomingInvoice,
    currentSubscription,
    message: 'added a new profile',
    action: 'create'
  };

  const profile = Object.assign({}, this.request.body);
  const id = yield db.createProfile()(this.currentUser.id, profile);
  this.flash = 'Profile added successfully.';

  this.redirect(router.url('profiles'));
});

router.post('/update-profile', hasSubscription, function*() {
  const profile = Object.assign({}, this.request.body);

  console.dir(profile)


  const id = yield db.updateProfile(this.request.body.editID, profile);
  this.redirect(router.url('profiles'));
});

router.post('/delete-profile', hasSubscription, function*() {
  const {currentInvoice, upcomingInvoice, currentSubscription} = yield getFutureInvoice(this.currentUser.id);
  const data = {
    futureInvoice: upcomingInvoice,
    currentSubscription,
    message: 'deleted a profile',
    action: 'delete'
  };

  yield db.deleteProfile(this.request.body.id);
  this.flash = 'Profile deleted successfully.';
  this.redirect(router.url('profiles'));
});

export default router;
