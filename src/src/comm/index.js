'use strict';

const db = require('../db');
const debug = require('debug')('app:comm');
const uuid = require('node-uuid');
const email = require('./email.js');
const moment = require('moment');
const sms = require('./sms.js');
const _ = require('lodash');

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
    physician: record.physician,
    appointmentDate: moment.unix(record.visit_date).format('MMM-DD-YYYY'),
    surveyUrl: url,
    unsubscribeUrl: urlUnsubscribe
  });
  
  debug(`Survey ${id} email result ${JSON.stringify(emailResult, null, 2)}`);

  // Send SMS
  if (record.patient && !_.isEmpty(record.patient.phone)) {
    const smsResult = yield sms.sendSMS(record.patient.phone, 
      `Greetings from ${record.physician}'s office. Please fill this short survey to evaluate your visit - ${url}`);
    debug(`Survey ${id} SMS result ${JSON.stringify(smsResult, null ,2)}`);
  }
  else {
    debug(`SMS notification skipped due no phone number provided`);
  }

  return 0;
};
