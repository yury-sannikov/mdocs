'use strict';
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:patient-review');
const _ = require('lodash');
const db = require('../../db');
const communicator = require('../../comm');
import { checkAuthenticated, hasSubscription } from '../../belt';


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
  prefix: '/phi'
});

router.use(checkAuthenticated);

router.get('/', function*() {
  this.redirect(router.url('patient-reviews'));
});

router.get('patient-reviews', '/patient-reviews', function*() {
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

router.post('/resend-survey', hasSubscription, function*() {
  const data = yield db.surveyById(this.request.body.id);
  if (!hasDynamoData(data)) {
    this.redirect(router.url('patient-reviews'));
    return;
  }
  yield conductSurvey.call(this, this.request.body.id);

  this.redirect(router.url('patient-reviews'));
});

router.post('/new-request', hasSubscription, function*() {
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
    this.redirect(router.url('patient-reviews'));
    return;
  }

  const title = providerOrLocation[0][0].name;

  const questions = Object.assign({}, HARDCODED_QUESTIONS, { '2': title });
  debug(this.currentUser.id, survey, questions, title);
  const id = yield db.createNewSurvey()(this.currentUser.id, survey, questions, title);

  yield conductSurvey.call(this, id);

  this.redirect(router.url('patient-reviews'));
});

router.get('/review/:id', function*() {
  const data = yield db.surveyById(this.params.id);
  if (!data || !data[0] || data[0].length == 0) {
    this.redirect(router.url('patient-reviews'));
    return;
  }
  this.render('reviews/detail', Object.assign({}, this.jadeLocals, { survey: data[0][0] }), true);
});

router.post('/delete-survey', hasSubscription, function*() {
  yield db.deleteSurvey(this.request.body.id);
  this.flash = 'Review deleted successfully.';
  this.redirect(router.url('patient-reviews'));
});


module.exports = router;
