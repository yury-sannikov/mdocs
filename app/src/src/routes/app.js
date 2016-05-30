'use strict';
// 3rd party
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:index');
const _ = require('lodash');

// 1st party
const db = require('../db');
const communicator = require('../comm');

// const db = require('../db');
// const pre = require('../presenters');
// const mw = require('../middleware');
// const config = require('../config');
// const belt = require('../belt');
// const paginate = require('../paginate');
// const cache = require('../cache');

//
// The index.js routes file is mostly a junk drawer for miscellaneous
// routes until it's accumulated enough routes to warrant a new
// routes/*.js module.
//
const HARDCODED_QUESTIONS = {
  '0': 'Overall Satisfaction',
  '1': 'Staff',
  '2': 'Dr. Mary Mayer, MD'
};

const router = new Router({
  prefix: '/app'
});

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data[0]) && data[0].length > 0;
}

////////////////////////////////////////////////////////////
// Check for authentification for all routes below
router.use(function*(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.redirect(`/login?r=${encodeURIComponent(this.request.url)}`);
  }
});


// Show Dashboard
router.get('dashboard', '/', function*() {
  this.render('app/dashboard', this.jadeLocals, true);
});

router.get('/patient-reviews', function*() {
  const data = yield db.surveysForProvider(this.currentUser.id);
  const reviews = data[0].map((item) => {
    const avg = _.chain(item.answers).values().sum().value() / _.values(item.answers).length;
    return Object.assign({}, item, {averageRating: avg });
  });
  const providers = yield db.providersForAdmin(this.currentUser.id);
  const locations = yield db.locationsForAdmin(this.currentUser.id);
  this.render('reviews/reviews', Object.assign({}, this.jadeLocals, {reviews: reviews, providers: providers[0], locations: locations[0]}), true);
});

function* conductSurvey(id) {

  const result = yield communicator.conductSurvey(id);
  if (result.sms === true && result.email === true) {
    this.flash = 'Survey has been successfully delivered';
  } else {
    let flash = 'An error occurred while delivering survey. ';
    if (result.sms !== true) {
      flash = flash + 'Error while sending SMS. ';
    }
    if (result.email !== true) {
      flash = flash + 'Error while sending email. ';
    }
    this.flash = flash;
  }
}

router.post('/resend-survey', function*() {
  const data = yield db.surveyById(this.request.body.id);
  if (!hasDynamoData(data)) {
    this.redirect('patient-reviews');
    return;
  }
  yield conductSurvey.call(this, this.request.body.id);

  this.redirect('patient-reviews');
});

router.post('/new-request', function*() {
  const locationOrProvider = this.request.body.locationOrProvider;
  const reviewSite = this.request.body.reviewSite;
  const isProvider = this.request.body.isProvider === 'yes';

  if (!locationOrProvider || !reviewSite || !this.request.body.isProvider) {
    // Client JS should avoid this path
    throw Error('Form is not filled properly.');
  }

  const survey = Object.assign({}, this.request.body, {
    reviewFor: {
      id: locationOrProvider,
      reviewType: isProvider ? 'provider' : 'location'
    },
    reviewSite: reviewSite
  });

  const providerOrLocation = yield db.getReviewObject(survey.reviewFor.id, survey.reviewFor.reviewType);

  if (!hasDynamoData(providerOrLocation)) {
    debug(`Can't find review object: ${JSON.stringify(survey.reviewFor)}`);
    this.flash = 'Unable to find specified review object';
    this.redirect('patient-reviews');
    return;
  }

  const title = providerOrLocation[0][0].name;

  const questions = Object.assign({}, HARDCODED_QUESTIONS, { '2': title });
  console.log(this.currentUser.id, survey, questions, title);
  const id = yield db.createNewSurvey()(this.currentUser.id, survey, questions, title);

  yield conductSurvey.call(this, id);

  this.redirect('patient-reviews');
});

router.get('/review/:id', function*() {
  const data = yield db.surveyById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect('/app/patient-reviews');
    return;
  }
  this.render('reviews/detail', Object.assign({}, this.jadeLocals, { survey: data[0][0] }), true);
});

router.post('/delete-survey', function*() {
  yield db.deleteSurvey(this.request.body.id);
  this.flash = 'Review deleted successfully.';
  this.redirect('patient-reviews');
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


// Show Pricing & Sign up
router.get('/pricing-signup', function*() {
  // this.render('privacy/privacy', this.jadeLocals, true);
  console.log("Routed");
  res.sendFile(path.join(__dirname+'/pricing-signup.html'));
});

// Show providers
router.get('/providers', function*() {
  const data = yield db.providersForAdmin(this.currentUser.id);
  this.render('settings/providers', Object.assign({}, this.jadeLocals, {providers: data[0]}), true);
});

router.get('/provider/:id', function*() {
  const data = yield db.providerById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect('/app/providers');
    return;
  }
  this.render('settings/providerDetail', Object.assign({}, this.jadeLocals, { provider: data[0][0] }), true);
});

router.post('/new-provider', function*() {
  console.log(this.request.body);

  const provider = Object.assign({}, this.request.body);
  const id = yield db.createProvider()(this.currentUser.id, provider);

  this.redirect('providers');
});

router.post('/update-provider', function*() {
  console.log(this.request.body);

  const provider = Object.assign({}, this.request.body);
  const id = yield db.updateProvider(this.request.body.editID, provider);

  this.redirect('providers');
});

router.post('/delete-provider', function*() {
  yield db.deleteProvider(this.request.body.id);
  this.flash = 'Provider deleted successfully.';
  this.redirect('providers');
});

// Show office locations
router.get('/locations', function*() {
  const data = yield db.locationsForAdmin(this.currentUser.id);
  this.render('settings/locations', Object.assign({}, this.jadeLocals, {locations: data[0]}), true);
});

router.get('/location/:id', function*() {
  const data = yield db.locationById(this.params.id);
  console.log(this.params.id)
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect('/app/locations');
    return;
  }
  this.render('settings/locationDetail', Object.assign({}, this.jadeLocals, { location: data[0][0] }), true);
});

router.post('/new-location', function*() {
  console.log(this.request.body);

  const location = Object.assign({}, this.request.body);
  const id = yield db.createLocation()(this.currentUser.id, location);

  this.redirect('locations');
});

router.post('/update-location', function*() {
  console.log(this.request.body);

  const location = Object.assign({}, this.request.body);
  const id = yield db.updateLocation(this.request.body.editID, location);

  this.redirect('locations');
});

router.post('/delete-location', function*() {
  yield db.deleteLocation(this.request.body.id);
  this.flash = 'Location deleted successfully.';
  this.redirect('locations');
});


module.exports = router;
