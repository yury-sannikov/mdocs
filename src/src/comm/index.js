'use strict';

const db = require('../db');
const debug = require('debug')('app:comm');
const uuid = require('node-uuid');
const email = require('./email.js');
const moment = require('moment');

exports.generateSurveyUrl = function(id, code) {
  return `https://app.mdocs.co/app/survey/${id}:${code}`;
};

exports.generateUnsubscriveUrl = function(id, code) {
  return `https://app.mdocs.co/app/stop-survey/${id}:${code}`;
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
    appointmentDate: moment.unix(record.record).format('MMM-DD-YYYY'),
    surveyUrl: url,
    unsubscribeUrl: urlUnsubscribe
  });
  
  debug(`Survey ${id} email result ${emailResult}`);
  
  return 0;
  

  
  // Send SMS
  // TODO

};
