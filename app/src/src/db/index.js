'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const uuid = require('node-uuid');
const moment = require('moment');
const _ = require('lodash');

// Review sites validation and formatting
const checkReviewSite = function(sites) {
  // Firstly check if provided for the selected option
  switch(sites.defaultReviewSite) {
    case 'yelp':
      if(!_.isEmpty(sites.yelp)) { return 'yelp'; } 
      break;
    case 'google':
      if(!_.isEmpty(sites.google)) { return 'google'; } 
      break;
    case 'healthgrades':
      if(!_.isEmpty(sites.healthgrades)) { return 'healthgrades'; } 
      break;
    case 'vitals':
      if(!_.isEmpty(sites.vitals)) { return 'vitals'; } 
      break;
    case 'ratemds':
      if(!_.isEmpty(sites.ratemds)) { return 'ratemds'; } 
      break;
    case 'yellowpages':
      if(!_.isEmpty(sites.yellowpages)) { return 'yellowpages'; } 
      break;
    default:
      break;
  }

  // Otherwise choose the first option
  if(!_.isEmpty(sites.yelp)) { return 'yelp'; } 
  if(!_.isEmpty(sites.google)) { return 'google'; } 
  if(!_.isEmpty(sites.healthgrades)) { return 'healthgrades'; } 
  if(!_.isEmpty(sites.vitals)) { return 'vitals'; } 
  if(!_.isEmpty(sites.ratemds)) { return 'ratemds'; } 
  if(!_.isEmpty(sites.yellowpages)) { return 'yellowpages'; } 
}

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
exports.surveysForProvider = function (providerId) {
  const chain = DynamoDB
    .table('survey_review')
    .where('provider_id').eq(providerId)
    .order_by('provider_id-survey_date-index').descending();
  return Promise.promisify(chain.query, {context: chain});
};

exports.surveyById = function (id) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id);
  return Promise.promisify(chain.query, {context: chain});
};

exports.getReviewObject = function (id, type) {
  const isProvider = type === 'provider';

  const chain = DynamoDB
    .table(isProvider ? 'providers' : 'locations')
    .where('id').eq(id);
  return Promise.promisify(chain.query, {context: chain});
};


exports.createNewSurvey = function() {
  return function* (providerId, survey, questions, title) {
    const chain = DynamoDB
      .table('survey_review');
    const insertAsync = Promise.promisify(chain.insert, {context: chain});
    const id = uuid.v4();

    var newSurvey = {
      id: id,
      provider_id: providerId,
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

exports.assignSurveyCode = function* (id, surveyCode) {
  const chain = DynamoDB
    .table('survey_review')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
    survey_code: surveyCode ? surveyCode : DynamoDB.del()
  });
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

  const thisUser = yield exports.findUserById(id);

  if (!thisUser) {
    return;
  }

  const upsertAsync = Promise.promisify(chain.insert_or_replace, {context: chain});

  return yield upsertAsync(Object.assign({}, thisUser, user));
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

// PROVIDERS
exports.providersForAdmin = function(adminId) {
  const chain = DynamoDB
    .table('providers')
    .where('admin_id').eq(adminId)
    .order_by('admin_id-index');
  return Promise.promisify(chain.query, {context: chain});
}

exports.providerById = function (id) {
  const chain = DynamoDB
    .table('providers')
    .where('id').eq(id);
  return Promise.promisify(chain.query, {context: chain});
};

exports.createProvider = function() {
  return function* (adminId, data) {
    const chain = DynamoDB
      .table('providers');
    const insertAsync = Promise.promisify(chain.insert, {context: chain});
    const id = uuid.v4();

    yield insertAsync({
      id: id,
      admin_id: adminId,
      name: data.name,
      email: data.email,
      phone: data.phoneMobile,
      review_sites: formatReviewSites(data),
      default_review_site: checkReviewSite(data)
    });
    return id;
  };
};

exports.updateProvider = function* (id, data) {
  const chain = DynamoDB
    .table('providers')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
      name: data.name,
      email: data.email,
      phone: data.phoneMobile,
      review_sites: formatReviewSites(data),
      default_review_site: checkReviewSite(data)
    });
};

exports.deleteProvider = function* (id) {
  const chain = DynamoDB
    .table('providers')
    .where('id').eq(id);

  const deleteAsync = Promise.promisify(chain.delete, {context: chain});

  return yield deleteAsync();
};

// LOCATIONS
exports.locationsForAdmin = function(adminId) {
  const chain = DynamoDB
    .table('locations')
    .where('admin_id').eq(adminId)
    .order_by('admin_id-index');
  return Promise.promisify(chain.query, {context: chain});
}

exports.locationById = function (id) {
  const chain = DynamoDB
    .table('locations')
    .where('id').eq(id);
  return Promise.promisify(chain.query, {context: chain});
};

exports.createLocation = function() {
  return function* (adminId, data) {
    const chain = DynamoDB
      .table('locations');
    const insertAsync = Promise.promisify(chain.insert, {context: chain});
    const id = uuid.v4();

    yield insertAsync({
      id: id,
      admin_id: adminId,
      name: data.name,
      address: data.address,
      email: data.email,
      phone: data.phoneMobile,
      review_sites: formatReviewSites(data),
      default_review_site: checkReviewSite(data)
    });
    return id;
  };
};

exports.updateLocation = function* (id, data) {
  const chain = DynamoDB
    .table('locations')
    .where('id').eq(id);

  const updateAsync = Promise.promisify(chain.update, {context: chain});

  return yield updateAsync({
      name: data.name,
      address: data.address,
      email: data.email,
      phone: data.phoneMobile,
      review_sites: formatReviewSites(data),
      default_review_site: checkReviewSite(data)
    });
};

exports.deleteLocation = function* (id) {
  const chain = DynamoDB
    .table('locations')
    .where('id').eq(id);

  const deleteAsync = Promise.promisify(chain.delete, {context: chain});

  return yield deleteAsync();
};
