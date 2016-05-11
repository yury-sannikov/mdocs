'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB();
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const uuid = require('node-uuid');
const moment = require('moment');


exports.surveysForProvider = function (providerId) {
  const chain = DynamoDB
    .table('survey_review')
    .where('provider_id').eq(providerId);
  return Promise.promisify(chain.query, {context: chain});
};

exports.surveyById = function (id) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id)
    .order_by('id-index');
  return Promise.promisify(chain.query, {context: chain});
};

exports.createNewSurvey = function() {
  return function* (providerId, survey, questions) {
    const chain = DynamoDB
      .table('survey_review');
    const insertAsync = Promise.promisify(chain.insert, {context: chain});
    const id = uuid.v4();
    yield insertAsync({
      id: id,
      provider_id: providerId,
      status: 0,
      survey_date: moment().utc().unix(),
      visit_date: moment(survey.visitDate).utc().unix(),
      questions: questions,
      patient: {
        'email': survey.email,
        'name': survey.name,
        'phone': survey.phoneMobile
      },
      physician: survey.physician
    });
    return id;
  };
};

exports.assignSurveyCode = function* (id, surveyCode) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id)
    .order_by('id-index').return(DynamoDB.ALL_OLD);
  const updateAsync = Promise.promisify(chain.update, {context: chain});
  
  yield updateAsync({
    survey_code: surveyCode ? surveyCode : DynamoDB.del()
  });
};
