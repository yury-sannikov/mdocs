'use strict';

const db = require('../db');
const debug = require('debug')('app:comm');
const uuid = require('node-uuid');
const email = require('./email.js');
const moment = require('moment');

exports.generateSurveyUrl = function(id, code) {
  return `https://app.mdocs.co/app/survey/${id}_${code}`;
};

exports.conductSurvey = function* (id) {
  // Search for survey
  const survey = yield db.surveyById(id);
  const surveyData = survey[0];
  
  if (!surveyData || surveyData.length == 0) {
    console.log(`Can't conduct survey id #{id}. Record not found`);       
  }
  // Generate unique one-shot code for survey
  const surveyCode = uuid.v4();

  // Write code to the database
  const rec = yield db.assignSurveyCode(id, surveyCode);

  // // Generate survey URL
  // const url = exports.generateSurveyUrl(id, surveyCode);
  // console.log('4');

  // // Send email
  // const record = surveyData[0];
  
  // email.sendReviewRequest(record.patient.email, {
  //   physician: record.physician,
  //   appointmentDate: moment.unix(record.record).format('MMM-DD-YYYY'),
  //   surveyUrl: url,
  //   unsubscribeUrl: 'https://app.mdocs.co#todo'
  // });
  // console.log('5');
  
  // Send SMS
  // TODO

};
