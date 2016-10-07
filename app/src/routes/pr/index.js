'use strict';
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');
const db = require('../../db');
const communicator = require('../../comm');
import { checkAuthenticated, hasPatientReviews } from '../../belt';
import { getProfiles, createProfile, deleteProfile } from '../../db/profiles'
export const KNOWN_SITES = {
  yelp: {
    name: 'Yelp',
    icon128: '/app/img/psl/yelp.png',
    icon128x2: '/app/img/psl/yelp@2x.png'
  },
  google: {
    name: 'Google Plus',
    icon128: '/app/img/psl/google.png',
    icon128x2: '/app/img/psl/google@2x.png'
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
    icon128: '/app/img/psl/ratemds.png',
    icon128x2: '/app/img/psl/ratemds@2x.png'
  },
  yellowpages: {
    name: 'YellowPages',
    icon128: '/app/img/psl/yp.png',
    icon128x2: '/app/img/psl/yp@2x.png'
  },
  fb: {
    name: 'Facebook',
    icon128: '/app/img/psl/fb.png',
    icon128x2: '/app/img/psl/fb@2x.png'
  }
}

export function getQuestionsForUser(profiles) {
  const questions = profiles.map(p => {
    return {
      questions:p.questions || DEFAULT_QUESTIONS,
      id: p.id
    }
  })
  return questions
}

const DEFAULT_QUESTIONS = {
  '0': 'Overall Satisfaction',
  '1': 'Staff',
  '2': 'Doctor'
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
  const profiles = yield getProfiles(this.currentUser.account.profiles)
  this.render('settings/profiles', Object.assign({}, this.jadeLocals, { profiles: profiles }), true);
});

router.get('/profile/:id', function*() {
  const data = yield db.profileById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect(router.url('profiles'));
    return;
  }
  this.render('settings/profileDetail', Object.assign({}, this.jadeLocals, { profile: data[0][0] }), true);
});

router.get('/new-profile', checkAuthenticated, hasPatientReviews, function*() {

  this.render('settings/createEditProfile', Object.assign({}, this.jadeLocals, {
    isNewProfile: true,
    profile: {
      knownSites: KNOWN_SITES,
      review_sites: {}
    }
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

router.post('/new-profile', hasPatientReviews, function*() {
  const data = {
    message: 'added a new profile',
    action: 'create'
  };

  const profile = Object.assign({}, this.request.body);
  const id = yield createProfile(this, profile);
  this.flash = 'Profile added successfully.';

  this.redirect(router.url('profiles'));
});

router.post('/update-profile', hasPatientReviews, function*() {
  const profile = Object.assign({}, this.request.body);

  console.dir(profile)


  const id = yield db.updateProfile(this.request.body.editID, profile);
  this.redirect(router.url('profiles'));
});

router.post('/delete-profile', hasPatientReviews, function*() {
  yield deleteProfile(this, this.request.body.id);
  this.flash = 'Profile deleted successfully.';
  this.redirect(router.url('profiles'));
});


router.get('customize', '/customize', function*() {
  const profiles = yield getProfiles(this.currentUser.account.profiles)

  const questions = getQuestionsForUser(profiles)
  const objectToIdQuestion = (el) => _.map(el, (v, k) => ({id: k, question: v}))
  const mappedQuestions = questions.reduce(
    (o,q) => { return Object.assign(o, { [q.id]:objectToIdQuestion(q.questions) });  },
    {})
  this.render('reviews/customize', Object.assign({}, this.jadeLocals, {
    profiles: profiles,
    questions: mappedQuestions
  }), true);
});

router.post('/customize', hasPatientReviews, function*() {
  const questionsObject = this.request.body.questions.reduce((o, v, i) => {
    return Object.assign(o, { [i]: v} )
  }, {})
  yield db.updateProfileSurveyQuestions(this.request.body.id, questionsObject);
  this.flash = 'Review questions saved successfully.';
  this.redirect('customize');
});


export default router;
