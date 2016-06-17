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

export function queryUnprocessed$(limit, $lastKey) {
  return new Promise(function (resolve, reject) {
    let chain = DynamoDB
      .table('sccds_list')
      .having('yelpBusinessId').undefined()
      .limit(limit);
    if (limit) {
      chain = chain.resume($lastKey)
    }
    chain.scan(function( err, data ) {
      if (err) {
        return reject(err);
      }
      resolve({
        data,
        key: this.LastEvaluatedKey
      });
    });
  });
};

export function* saveRecord$(key, data) {
  const chain = DynamoDB
    .table('sccds_list')
    .where('fullname').eq(key);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return updateAsync(data);
}
