'use strict';
// 3rd party
const assert = require('better-assert');
const Router = require('koa-router');
const debug = require('debug')('app:routes:survey');
const _ = require('lodash');

// 1st party
const db = require('../../db');
const communicator = require('../../comm');


// const HARDCODED_QUESTIONS = {
//   '0': 'Overall Satisfaction',
//   '1': 'Staff',
//   '2': 'Dr. Mary Mayer, MD'
// };

const SURVEY_STATUS_NEW = 0;
const SURVEY_STATUS_ACCESSED = 1;
const SURVEY_STATUS_SUBMITTED = 2;

const MINIMUM_OKAY_SURVEY_VALUE = 3; // 5 stars is eq to 4.

const surveyUrls = {
  'yelp': 'https://www.yelp.com/biz/{{id}}',
  'yellowpages': 'http://www.yellowpages.com/contribute/businesses/{{id}}/review?star_rate=5',
  'vitals': 'http://www.vitals.com/review/{{id}}',
  'google': 'https://plus.google.com/{{id}}',
  'healthgrades': 'http://www.healthgrades.com/physician/{{id}}',
  'ratemds': 'https://www.ratemds.com/doctor-ratings/{{id}}'
};

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

  // Check survey status (0 - new, 1 - accessed, 2 - submitted)
  if (survey.status > SURVEY_STATUS_ACCESSED) {

    this.render('reviews/landing', Object.assign({}, this.jadeLocals, {
      messages: makeErrorMessage('Review has been submitted already.')
    }), true);

    return;
  }

  yield db.updateSurveyStatus(survey.id, SURVEY_STATUS_ACCESSED);

  this.render('reviews/landing', Object.assign({}, this.jadeLocals, { survey: survey }), true);
});

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

  if (survey.status >= SURVEY_STATUS_SUBMITTED) {
    this.render('reviews/landing', Object.assign({}, this.jadeLocals, {
      messages: makeErrorMessage('Survey has been already submitted.')
    }), true);
    return;
  }

  const ansvers = JSON.parse(this.request.body.survey);

  const asObject = _.reduce(ansvers, (r, v, k) => { r[k] = v.value + 1; return r;}, {});

  yield db.updateSurveyStatus(survey.id, SURVEY_STATUS_SUBMITTED, asObject);

  const minValue = _.minBy(ansvers, o => o.value);

  if (minValue.value < MINIMUM_OKAY_SURVEY_VALUE) {
    yield communicator.notifyWithNegativeReview(survey);
    this.render('reviews/negative', Object.assign({}, this.jadeLocals, { survey: survey }), true);
  } else {
    const profile = yield db.profileById(survey.reviewFor.id);

    const siteId = profile[0][0].review_sites[survey.reviewSite];

    if (!siteId) {
      throw Error(`Review Site '${survey.reviewSite}' wasn't registered.`);
    }

    const surveyUrl = surveyUrls[survey.reviewSite];

    if (!surveyUrl) {
      throw Error(`Unknow URL for review site '${survey.reviewSite}'`);
    }

    const reviewLink = surveyUrl.replace('{{id}}', siteId);

    this.render('reviews/positive', Object.assign({}, this.jadeLocals, {
      survey: survey,
      reviewLink: siteId//reviewLink
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
