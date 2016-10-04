'use strict';
// 3rd party
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:survey');
const _ = require('lodash');

// 1st party
const db = require('../../db');
const communicator = require('../../comm');


const SURVEY_STATUS_NEW = 0;
const SURVEY_STATUS_ACCESSED = 1;
const SURVEY_STATUS_SUBMITTED = 2;

const MINIMUM_OKAY_SURVEY_VALUE = 3; // 5 stars is eq to 4.

import { KNOWN_SITES } from './index'

function makeErrorMessage(msg) {
  return {
    error: [
      {
        msg: msg
      }
    ]
  };
}

const router = new Router({
  prefix: '/pr/survey'
});


// Go home, sleep well
router.get('/', function*() {
  this.redirect('/');
});

router.get('/:idkey', function*() {
  const idKey = (this.params.idkey || '').split(':');

  // Parse id and survey key
  if (!_.isArray(idKey) || idKey.length === 0) {
    debug(`Wrong survey id-key format. Supplied parameter: ${this.params.idkey}`);
    this.redirect('/');
    return;
  }

  // Get survey by id
  const data = yield db.surveyById(idKey[0]);
  if (!data || !data[0] || data[0].length == 0) {
    this.render('reviews/landing', Object.assign({}, this.jadeLocals, {
      messages: makeErrorMessage('Thank you for participating in our survey. Your survey has been deleted by an administrator.')
    }), true);
    return;
  }
  const survey = data[0][0];

  //Check survey status (0 - new, 1 - accessed, 2 - submitted)
  if (survey.status > SURVEY_STATUS_ACCESSED) {

    this.render('reviews/landing', Object.assign({}, this.jadeLocals, {
      messages: makeErrorMessage('Review has been submitted already.')
    }), true);

    return;
  }

  yield db.updateSurveyStatus(survey.id, SURVEY_STATUS_ACCESSED);

  this.render('reviews/landing', Object.assign({}, this.jadeLocals, { survey: survey }), true);
});

router.get('forwarder','/forward/:idkey', function*() {

  const data = yield db.surveyById(this.params.idkey);
  if (data && data[0] && data[0].length != 0) {
    const survey = data[0][0];
    yield db.updateSurveyStats(survey.id, this.request.query.k);
  }

  this.redirect(this.request.query.to)
})


router.post('/submit', function*() {

  // Get survey by id
  const data = yield db.surveyById(this.request.body.id || '0');
  if (!data || !data[0] || data[0].length == 0) {
    this.render('reviews/landing', Object.assign({}, this.jadeLocals, {
      messages: makeErrorMessage('Thank you for participating in our survey. Your survey has been deleted by an administrator.')
    }), true);
    return;
  }
  const survey = data[0][0];

  const ansvers = JSON.parse(this.request.body.survey);

  const asObject = _.reduce(ansvers, (r, v, k) => { r[k] = v.value + 1; return r;}, {});

  yield db.updateSurveyStatus(survey.id, SURVEY_STATUS_SUBMITTED, asObject);

  const minValue = _.minBy(ansvers, o => o.value);

  const profile = yield db.profileById(survey.reviewFor.id);

  if (!profile || !profile[0] || profile[0].length == 0) {
    this.render('reviews/landing', Object.assign({}, this.jadeLocals, {
      messages: makeErrorMessage('Thank you for participating in our survey. Your survey has been deleted by an administrator.')
    }), true);
    return;
  }

  const profileItem = profile[0][0]

  if (minValue.value < MINIMUM_OKAY_SURVEY_VALUE) {
    yield communicator.notifyWithReview(survey, profileItem, false);
    this.render('reviews/negative', Object.assign({}, this.jadeLocals, { survey: survey }), true);
  } else {

    yield communicator.notifyWithReview(survey, profileItem, true);

    const sitesList = profileItem.review_sites_onsurvey || [survey.reviewSite]
    let sites = _.compact(_.map(profileItem.review_sites, (v, k) => {
      if (!sitesList[k]) return null;
      return {
        key: k,
        url: encodeURIComponent(v),
        meta: KNOWN_SITES[k]
      }
    }))
    this.render('reviews/positive', Object.assign({}, this.jadeLocals, {
      survey: survey,
      sites: sites,
      forwardUrl: router.url('forwarder', {idkey: this.request.body.id})
    }), true);
  }
});


router.post('/details', function*() {

  if (!_.isEmpty(this.request.body.details)) {
    yield db.updateSurveyDetails(this.request.body.id, this.request.body.details);
  }

  this.redirect('/');
});


module.exports = router;
