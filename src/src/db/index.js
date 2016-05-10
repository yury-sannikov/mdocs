'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB();
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));



exports.surveysForProvider = function (providerId) {
  const chain = DynamoDB
    .table('survey_review')
    .where('provider_id').eq(providerId);
  return Promise.promisify(chain.query, {context: chain});
};
