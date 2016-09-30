'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data) && data.length > 0;
}

export function* getUser(fullname) {
  const chain = DynamoDB
    .table('sccds_list')
    .where('fullname').eq(fullname);

  const queryAsync = Promise.promisify(chain.query, {context: chain});

  const user = yield queryAsync();

  return hasDynamoData(user) ? user[0] : null;
}
