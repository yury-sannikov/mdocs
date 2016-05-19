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
 

const Bitly = Promise.promisifyAll(new BitlyAPI({
  client_id: config.BITLY_CLIENT_ID,
  client_secret: config.BITLY_CLIENT_SECRET
}));

Bitly.setAccessToken(config.BITLY_TOKEN);


exports.generateSurveyDetailsUrl = function(id) {
  return `https://app.mdocs.co/app/review/${id}`;
};

exports.generateSurveyUrl = function(id, code) {
  return `https://app.mdocs.co/survey/${id}:${code}`;
};

exports.generateUnsubscriveUrl = function(id, code) {
  return `https://app.mdocs.co/stop-survey/${id}:${code}`;
};

exports.conductSurvey = function* (id) {
  // Search for survey
  const survey = yield db.surveyById(id);
  const surveyData = survey[0];
  
  if (!surveyData || surveyData.length == 0) {
    console.log(`Can't conduct survey id #{id}. Record not found`);
    return -1;    
  }
  // Generate unique one-shot code for survey
  const surveyCode = uuid.v4();

  // Write code to the database
  yield db.assignSurveyCode(id, surveyCode);

  // Generate URLs
  const url = exports.generateSurveyUrl(id, surveyCode);
  const urlUnsubscribe = exports.generateUnsubscriveUrl(id, surveyCode);

  // Send email
  const record = surveyData[0];
  
  const emailResult = yield email.sendReviewRequest(record.patient.email, {
    physician: record.title,
    appointmentDate: moment.unix(record.visit_date).format('MMM-DD-YYYY'),
    surveyUrl: url,
    unsubscribeUrl: urlUnsubscribe
  });
  
  debug(`Survey ${id} email result ${JSON.stringify(emailResult, null, 2)}`);
  
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
    const smsResult = yield sms.sendSMS(record.patient.phone, 
      `Greetings from ${record.physician}'s office. Please fill this short survey to evaluate your visit - ${shortenedLink}`);
    debug(`Survey ${id} SMS result ${JSON.stringify(smsResult, null ,2)}`);
  }
  else {
    debug(`SMS notification skipped due no phone number provided`);
  }

  return 0;
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
    text: `A negative review was just posted. Please view the survey here: ${surveyDetailsUrl}`,
    channel: '#mdocs',
    username: 'MDOCS Apps Portal',
    icon_emoji: ':-1:'
  });
  
  debug(`Negative review ${survey.id} email notification result ${JSON.stringify(emailResult, null, 2)}`);  

  const smsResult = yield sms.sendSMS(officeAdministrator.phone, 
    `A negative review was just posted. Please view the survey here: ${surveyDetailsUrl}`);
    
  debug(`Negative review ${survey.id} SMS result ${JSON.stringify(smsResult, null ,2)}`);

};
