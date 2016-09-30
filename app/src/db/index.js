'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');

// Review sites validation and formatting

const formatReviewSites = function(sites) {
  var formatted = {};

  if(!_.isEmpty(sites.yelp)) { formatted = Object.assign({}, formatted, { 'yelp': sites.yelp }); }
  if(!_.isEmpty(sites.google)) { formatted = Object.assign({}, formatted, { 'google': sites.google }); }
  if(!_.isEmpty(sites.healthgrades)) { formatted = Object.assign({}, formatted, { 'healthgrades': sites.healthgrades }); }
  if(!_.isEmpty(sites.vitals)) { formatted = Object.assign({}, formatted, { 'vitals': sites.vitals }); }
  if(!_.isEmpty(sites.ratemds)) { formatted = Object.assign({}, formatted, { 'ratemds': sites.ratemds }); }
  if(!_.isEmpty(sites.yellowpages)) { formatted = Object.assign({}, formatted, { 'yellowpages': sites.yellowpages }); }

  return formatted;
};

function hasDynamoData(data) {
  if (_.isEmpty(data) || !_.isArray(data)) {
    return false;
  }
  return _.isArray(data) && data.length > 0;
}

// SURVEYS - PATIENT REVIEWS
exports.surveysForProfile = function (profileId) {
  const chain = DynamoDB
    .table('survey_review')
    .where('provider_id').eq(profileId)
    .order_by('provider_id-survey_date-index').descending();
  return Promise.promisify(chain.query, {context: chain});
};

exports.surveyById = function (id) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id);
  return Promise.promisify(chain.query, {context: chain});
};

exports.createNewSurvey = function() {
  return function* (profileId, survey, questions, title) {
    const chain = DynamoDB
      .table('survey_review');
    const insertAsync = Promise.promisify(chain.insert, {context: chain});
    const id = uuid.v4();

    var newSurvey = {
      id: id,
      provider_id: profileId,
      status: 0,
      survey_date: moment().utc().unix(),
      visit_date: moment(survey.visitDate).utc().unix(),
      questions: questions,
      patient: {
        'email': survey.email,
        'name': survey.name
      },
      title: title,
      reviewFor: survey.reviewFor,
      reviewSite: survey.reviewSite
    };

    if(!_.isEmpty(survey.phoneMobile)) {
      newSurvey.patient.phone = survey.phoneMobile;
    }

    yield insertAsync(newSurvey);

    return id;
  };
};

exports.deleteSurvey = function* (id) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id);

  const deleteAsync = Promise.promisify(chain.delete, {context: chain});

  return yield deleteAsync();
};

exports.updateSurveyStatus = function* (id, status, answers) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
    status: status,
    answers: answers ? answers : DynamoDB.del()
  });
};

exports.updateSurveyDetails = function* (id, details) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
    details: details
  });
};


// USERS
exports.insertOrUpdateUser = function* (id, user) {
  const chain = DynamoDB
    .table('survey_users')
    .where('id').eq(id);

  let thisUser = yield exports.findUserById(id);

  if (!thisUser) {
    thisUser = { id };
  }

  const upsertAsync = Promise.promisify(chain.insert_or_replace, {context: chain});

  return yield upsertAsync(Object.assign({}, thisUser, user));
};

exports.updateDefaultSurveyQuestions = function* (id, data) {
  const chain = DynamoDB
    .table('survey_users')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  var updatedUser = {
    questions: data
  };

  return yield updateAsync(updatedUser);
};

exports.deleteUserSubscriptionsInfo = function* (id) {
  const chain = DynamoDB
    .table('survey_users')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
    stripeCustomer: DynamoDB.del(),
    stripeToken: DynamoDB.del()
  });
};

exports.findUserByEmail = function* (email) {
  const chain = DynamoDB
    .table('survey_users')
    .where('email').eq(email)
    .order_by('email-index');

  const queryAsync = Promise.promisify(chain.query, {context: chain});

  const user = yield queryAsync();

  return hasDynamoData(user) ? user[0] : null;
};


exports.findUserById = function* (id) {
  const chain = DynamoDB
    .table('survey_users')
    .where('id').eq(id);

  const queryAsync = Promise.promisify(chain.query, {context: chain});

  const user = yield queryAsync();

  return hasDynamoData(user) ? user[0] : null;
};

export function* updateUserStripeCustomerToken(id, customer, token) {
  const chain = DynamoDB
    .table('survey_users')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
    stripeCustomer: customer,
    stripeToken: token
  });
}

// PROFILES
exports.profilesForAdmin = function(adminId) {
  const chain = DynamoDB
    .table('profiles')
    .where('admin_id').eq(adminId)
    .order_by('admin_id-index');
  return Promise.promisify(chain.query, {context: chain});
}

exports.profileById = function (id) {
  const chain = DynamoDB
    .table('profiles')
    .where('id').eq(id);
  return Promise.promisify(chain.query, {context: chain});
};

exports.createProfile = function() {
  return function* (adminId, data) {
    const chain = DynamoDB
      .table('profiles');
    const insertAsync = Promise.promisify(chain.insert, {context: chain});
    const id = uuid.v4();

    var newProfile = {
      id: id,
      admin_id: adminId,
      name: data.name,
      email: data.email,
      phone: data.phoneMobile,
      type: data.profileType,
      review_sites: formatReviewSites(data)
    };
    if(!_.isEmpty(data.address)) {
      newProfile.address = data.address;
    }

    yield insertAsync(newProfile);
    return id;
  };
};

exports.updateProfile = function* (id, data) {
  const chain = DynamoDB
    .table('profiles')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  var newProfile = {
      name: data.name,
      email: data.email,
      phone: data.phoneMobile,
      type: data.profileType,
      review_sites: formatReviewSites(data)
    };
    if(!_.isEmpty(data.address)) {
      newProfile.address = data.address;
    }

  return yield updateAsync(newProfile);
};

exports.deleteProfile = function* (id) {
  const chain = DynamoDB
    .table('profiles')
    .where('id').eq(id);

  const deleteAsync = Promise.promisify(chain.delete, {context: chain});

  return yield deleteAsync();
};

exports.findAccountById = function* (accountId) {
  const chain = DynamoDB
    .table('mdocsapps_account')
    .where('account_id').eq(accountId);

  const queryAsync = Promise.promisify(chain.query, {context: chain});

  const account = yield queryAsync();

  return hasDynamoData(account) ? account[0] : null;
};

