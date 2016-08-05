'use strict';

const db = require('../db');
const debug = require('debug')('app:comm');
const uuid = require('node-uuid');
const email = require('./email.js');
const moment = require('moment');
const sms = require('./sms.js');
const _ = require('lodash');
const BitlyAPI = require('node-bitlyapi');
const Promise = require('bluebird');
const config = require('../config');

const Slack = Promise.promisifyAll(require('slack-notify')(config.SLACK_WEBHOOK_URL));
const MarketingSlack = Promise.promisifyAll(require('slack-notify')(config.SLACK_MARKETING_WEBHOOK_URL));


const Bitly = Promise.promisifyAll(new BitlyAPI({
  client_id: config.BITLY_CLIENT_ID,
  client_secret: config.BITLY_CLIENT_SECRET
}));

Bitly.setAccessToken(config.BITLY_TOKEN);


exports.generateSurveyDetailsUrl = function(id) {
  return `https://app.mdocs.co/app/pr/phi/review/${id}`;
};

exports.generateSurveyUrl = function(id) {
  return `https://app.mdocs.co/app/pr/survey/${id}`;
};

exports.generateUnsubscriveUrl = function(id) {
  return `https://app.mdocs.co/app/pr/survey/stop/${id}`;
};

exports.conductSurvey = function* (id) {
  // true - ok, false - skipped, string/Error - error
  let result = {
    sms: false,
    email: false
  };

  // Search for survey
  const survey = yield db.surveyById(id);
  const surveyData = survey[0];

  if (!surveyData || surveyData.length == 0) {
    debug(`Can't conduct survey id #{id}. Record not found`);
    return result;
  }

  // Generate URLs
  const url = exports.generateSurveyUrl(id);
  const urlUnsubscribe = exports.generateUnsubscriveUrl(id);

  // Send email
  const record = surveyData[0];

  const emailLocals = {
    title: record.title,
    appointmentDate: moment.unix(record.visit_date).format('MMM-DD-YYYY'),
    surveyUrl: url,
    unsubscribeUrl: urlUnsubscribe
  };

  const isProviderReview = record.reviewFor.reviewType === 'Provider';

  try {
    const emailResult = yield email[isProviderReview ? 'sendReviewRequest' : 'sendLocationReviewRequest'](record.patient.email, emailLocals);

    debug(`Survey ${id} email result ${JSON.stringify(emailResult, null, 2)}`);

    result.email = true;
  }
  catch(e) {
    result.email = e;
  }

  var shortenedLink = url;
  // try {
  //   const response = JSON.parse(yield Bitly.shortenLinkAsync(url));

  //   if (response && response.status_code == 200) {
  //     shortenedLink = response.data.url;
  //     debug(`Shortened url: ${shortenedLink}`);
  //   } else {
  //     throw response;
  //   }
  // }
  // catch (err) {
  //   console.log(`Unable to shorten link through bitly api. Error: ${err}`);
  // }

  // Send SMS
  if (record.patient && !_.isEmpty(record.patient.phone)) {

    try {
      const smsResult = yield sms.sendSMS(record.patient.phone,
        `Greetings from ${record.title}'s office. Please complete this short review to evaluate your visit - ${shortenedLink}`);
      debug(`Survey ${id} SMS result ${JSON.stringify(smsResult, null ,2)}`);
      result.sms = true;
    }
    catch(e) {
      result.sms = e;
    }
  }
  else {
    debug(`SMS notification skipped due no phone number provided`);
  }

  return result;
};

exports.notifyWithNegativeReview = function* (survey) {
  var surveyDetailsUrl = exports.generateSurveyDetailsUrl(survey.id);

  const officeAdministrator = {
    email: 'levent@movel.co',
    phone: '+17035087934'
  };

  const emailResult = yield email.sendNegativeReviewNotification(officeAdministrator.email, {
    physician: survey.title,
    appointmentDate: moment.unix(survey.visit_date).format('MMM-DD-YYYY'),
    surveyUrl: surveyDetailsUrl,
    unsubscribeUrl: ''
  });

  yield Slack.alertAsync({
    text: `A negative review was just posted. You can see the review here: ${surveyDetailsUrl}`,
    channel: '#mdocs',
    username: 'MDOCS Apps Portal',
    icon_emoji: ':-1:'
  });

  debug(`Negative review ${survey.id} email notification result ${JSON.stringify(emailResult, null, 2)}`);

  const smsResult = yield sms.sendSMS(officeAdministrator.phone,
    `A negative review was just posted. You can see the review here: ${surveyDetailsUrl}`);

  debug(`Negative review ${survey.id} SMS result ${JSON.stringify(smsResult, null ,2)}`);

};

exports.sendExceptionToSlack = function* (err, ctx) {
  let message;
  if (_.isError(err)) {
    message = err.stack;
  } else {
    message = JSON.stringify(err, null, 2);
  }
  message = `${message}\nContext:\n${JSON.stringify(ctx, null, 2)}`;
  yield Slack.bugAsync({
    text: `MDOCS crashed with 500:\n${message}`,
    channel: '#mdocs',
    username: 'MDOCS Apps Portal',
    icon_emoji: ':interrobang:'
  });
};

export function* sendEmailTrackingToSlack(data) {
  yield Slack.successAsync({
    text: `Email open notification:\nFirst name: ${data.firstname}\n Last name: ${data.lastname}\n Email address: ${data.email}`,
    channel: '#marketing',
    username: 'moneybot'
  });
}

export function* sendStripeCallbackToSlack(data) {
  yield Slack.successAsync({
    text: `Stripe event of type ${data.type} has been received:\n${JSON.stringify(data, null, 2)}`,
    channel: '#mdocs',
    username: 'MDOCS Apps Portal'
  });
}

exports.notifyPlanChange = function* (id, data) {
  const user = yield db.findUserById(id);

  const emailResult = yield email.sendPlanChange(user.email, data);

  debug(`Plan update ${id} email notification result ${JSON.stringify(emailResult, null, 2)}`);
};

exports.notifySubscriptionCancel = function* (id) {
  const user = yield db.findUserById(id);
  
  const emailResult = yield email.sendSubscriptionCancel(user.email);

  debug(`Subscription Cancellation ${id} email notification result ${JSON.stringify(emailResult, null, 2)}`);
};
