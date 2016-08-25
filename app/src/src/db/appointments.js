'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const VanillaDynamoDB = Promise.promisifyAll($db);
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');


function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data) && data.length > 0;
}
const APPOINTMENTS_TABLE = 'mdocsapps_appointments'

const ACCOUNT_VISIT_INDEX = 'account_id-visit_date-index'

exports.appointmentById = function (id) {
  const chain = DynamoDB
    .table(APPOINTMENTS_TABLE)
    .where('id').eq(id)
  return Promise.promisify(chain.query, {context: chain});
};

function fuckThoseFuckingDynamoDbDevelopers(crap) {
  if (!_.isArray(crap.Items)) {
    return []
  }
  return crap.Items.map( item => {
    for (let key in item) {
      const v = item[key]
      item[key] = v.S || v.BOOL || (+v.N)
    }
    return item
  })
}

exports.appointmentsForAccount = function*(account_id) {

  var params = {
      TableName: APPOINTMENTS_TABLE,
      IndexName: ACCOUNT_VISIT_INDEX,
      KeyConditionExpression: "#account_id = :account_id and #visit_date >= :visit_date",
      ExpressionAttributeNames: {
       '#account_id': 'account_id',
       '#visit_date': 'visit_date'
      },
      ExpressionAttributeValues: {
          ':account_id': { S: account_id },
          ':visit_date': { N: '0' }
      }
  };
  return fuckThoseFuckingDynamoDbDevelopers(yield VanillaDynamoDB.queryAsync(params))
}

exports.createNewAppointment = function* (account_id, visit_date, appointment) {
  const chain = DynamoDB
    .table(APPOINTMENTS_TABLE);
  const insertAsync = Promise.promisify(chain.insert, {context: chain});

  for (let key in appointment) {
    if (appointment[key] === '') delete appointment[key]
  }
  appointment.id = uuid.v4();
  appointment.account_id = account_id;
  appointment.visit_date = moment(visit_date).utc().unix()
  appointment.status = 'new';
  yield insertAsync(appointment);

  return appointment.id;
};

