'use strict';
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:patient-review');
const _ = require('lodash');
const db = require('../../db');
import { getProfiles } from '../../db/profiles'
const communicator = require('../../comm');
import { checkAuthenticated, hasPatientReviews } from '../../belt';
import { getQuestionsForUser } from './index'


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
  const data = yield db.surveysForProfile(this.currentUser.id);
  const reviews = data[0].map((item) => {
    const avg = _.chain(item.answers).values().sum().value() / _.values(item.answers).length;
    return Object.assign({}, item, {averageRating: avg });
  });
  const profiles = yield getProfiles(this.currentUser.account.profiles)
  this.render('reviews/reviews', Object.assign({}, this.jadeLocals, {reviews: reviews, profiles: profiles}), true);
});

function* conductSurvey(id) {

  const result = yield communicator.conductSurvey(id);
  const trueOrSkipped = (v) => v === true || v === null

  if (trueOrSkipped(result.sms) && trueOrSkipped(result.email)) {
    this.flash = 'Invite sent successfully.';
  } else {
    let flash = 'An error occurred while delivering invite. ';
    if (!trueOrSkipped(result.sms)) {
      flash = flash + 'Error while sending SMS. ';
    }
    if (!trueOrSkipped(result.email)) {
      flash = flash + 'Error while sending email. ';
    }
    this.flash = flash;
  }
}

router.post('/resend-survey', hasPatientReviews, function*() {
  const data = yield db.surveyById(this.request.body.id);
  if (!hasDynamoData(data)) {
    this.redirect(router.url('patient-reviews'));
    return;
  }
  yield conductSurvey.call(this, this.request.body.id);

  this.redirect(router.url('patient-reviews'));
});

router.post('/new-request', hasPatientReviews, function*() {
  const selectedProfile = this.request.body.selectedProfile;
  const selectedProfileType = this.request.body.selectedProfileType;

  if (!selectedProfile || !selectedProfileType) {
    // Client JS should avoid this path
    throw Error('Form is not filled properly.');
  }

  const survey = Object.assign({}, this.request.body, {
    reviewFor: {
      id: selectedProfile,
      reviewType: selectedProfileType
    }
  });


  const profile = yield db.profileById(survey.reviewFor.id);

  if (!hasDynamoData(profile)) {
    debug(`Can't find review object: ${JSON.stringify(survey.reviewFor)}`);
    this.flash = 'Unable to find specified review object';
    this.redirect(router.url('patient-reviews'));
    return;
  }

  const title = profile[0][0].name;

  const questionsArray = getQuestionsForUser(profile[0])
  const questions = questionsArray[0].questions

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

router.post('/delete-survey', hasPatientReviews, function*() {
  yield db.deleteSurvey(this.request.body.id);
  this.flash = 'Review deleted successfully.';
  this.redirect(router.url('patient-reviews'));
});


module.exports = router;
