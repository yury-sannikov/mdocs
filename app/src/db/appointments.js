'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const VanillaDynamoDB = Promise.promisifyAll($db);
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');
import { fuckThoseFuckingDynamoDbDevelopers } from './index'

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data) && data.length > 0;
}
const APPOINTMENTS_TABLE = 'mdocsapps_appointments'

const ACCOUNT_VISIT_INDEX = 'profile_id-visit_date-index'
const PROFILE_CREATED_INDEX = 'profile_id-createdDate-index'

exports.appointmentById = function* (id) {
  const chain = DynamoDB
    .table(APPOINTMENTS_TABLE)
    .where('id').eq(id)
  const appointment = yield Promise.promisify(chain.query, {context: chain});
  return hasDynamoData(appointment) ? appointment[0][0] : null;
};

exports.updateAppointment = function* (id, newAppointment) {
  const chain = DynamoDB
    .table(APPOINTMENTS_TABLE)
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});
  delete newAppointment.id
  return yield updateAsync(newAppointment);
};

exports.appointmentsForAccount = function*(profile_id) {

  var params = {
      TableName: APPOINTMENTS_TABLE,
      IndexName: PROFILE_CREATED_INDEX,
      ScanIndexForward: false,
      KeyConditionExpression: "#profile_id = :profile_id and #createdDate >= :createdDate",
      ExpressionAttributeNames: {
       '#profile_id': 'profile_id',
       '#createdDate': 'createdDate'
      },
      ExpressionAttributeValues: {
          ':profile_id': { S: profile_id },
          ':createdDate': { N: '0' }
      }
  };
  return fuckThoseFuckingDynamoDbDevelopers(yield VanillaDynamoDB.queryAsync(params))
}

exports.createNewAppointment = function* (profileId, visit_date, appointment) {
  const chain = DynamoDB
    .table(APPOINTMENTS_TABLE);
  const insertAsync = Promise.promisify(chain.insert, {context: chain});

  for (let key in appointment) {
    if (appointment[key] === '') delete appointment[key]
  }
  appointment.id = uuid.v4();
  appointment.profile_id = profileId;
  appointment.visit_date = visit_date
  appointment.status = 'new';

  yield insertAsync(appointment);

  return appointment.id;
};

