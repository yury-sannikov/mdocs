'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const _ = require('lodash');

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data) && data.length > 0;
}

export function* queryUnprocessed() {
  const chain = DynamoDB
    .table('sccds_list')
    .having('yelpBusinessId').undefined()
    .limit(5);

  const queryAsync = Promise.promisify(chain.scan, {context: chain});

  const data = yield queryAsync();

  return hasDynamoData(data) ? data : null;
};
