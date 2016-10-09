'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const VanillaDynamoDB = Promise.promisifyAll($db);
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const _ = require('lodash');
const uuid = require('node-uuid');

const debug = require('debug')('app:db:profiles');
import { profileById, findAccountById, updateAccountById } from './index'
import { formSessionInfoForUser } from '../auth'

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data) && data.length > 0;
}

export function* getProfiles(profileIds) {
  profileIds = profileIds || []
  let profiles = yield profileIds.map( (v) => profileById(v) )
  profiles = _.chain(profiles)
    .map(p => hasDynamoData(p) ? p[0][0] : null)
    .compact()
    .value()

  return profiles;
}

export function* createProfile(self, data) {
  const chain = DynamoDB
    .table('profiles');
  const insertAsync = Promise.promisify(chain.insert, {context: chain});
  const id = uuid.v4();

  var newProfile = {
    id: id,
    name: data.name,
    email: data.email,
    phone: data.phoneMobile,
    type: data.profileType,
    review_sites: data.review_sites,
    review_sites_onsurvey: data.review_sites_onsurvey
  };
  if(!_.isEmpty(data.address)) {
    newProfile.address = data.address;
  }

  yield insertAsync(newProfile);

  const profiles = [...self.currentUser.account.profiles, id]
  yield setAccountProfilesForUser(self.currentUser.account_id, self.currentUser.id, profiles)

  const newUserParts = yield formSessionInfoForUser(self.currentUser.id)
  Object.assign(self.session.passport.user, newUserParts)

  debug(`Profile ${id} has been created. Profiles: ${profiles}`)

  return id;
};

export function* deleteProfile(self, id) {
  const chain = DynamoDB
    .table('profiles')
    .where('id').eq(id);

  const deleteAsync = Promise.promisify(chain.delete, {context: chain});

  yield deleteAsync();
  const profiles = self.currentUser.account.profiles.filter(p => p != id)

  yield setAccountProfilesForUser(self.currentUser.account_id, self.currentUser.id, profiles)

  const newUserParts = yield formSessionInfoForUser(self.currentUser.id)
  Object.assign(self.session.passport.user, newUserParts)

  debug(`Profile ${id} has been deleted. Profiles: ${profiles}`)
};

function* setAccountProfilesForUser(accountId, userId, profiles) {
  let acc = yield findAccountById(accountId)
  acc.profiles = acc.profiles || {}
  acc.profiles[userId] = profiles
  yield updateAccountById(accountId, acc)

}

