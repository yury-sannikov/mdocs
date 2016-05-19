'use strict';
const AWS = require('aws-sdk');
const $db = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const Promise = require('bluebird');
const DynamoDB = Promise.promisifyAll(require('aws-dynamodb')($db));
const uuid = require('node-uuid');
const moment = require('moment');

const formatReviewSites = function(sites) {
  var formatted = {};
  
  if(sites.yelp !== '') { formatted = Object.assign({}, formatted, { 'yelp': sites.yelp }); }
  if(sites.google !== '') { formatted = Object.assign({}, formatted, { 'google': sites.google }); }
  if(sites.healthgrades !== '') { formatted = Object.assign({}, formatted, { 'healthgrades':sites.healthgrades }); }
  if(sites.vitals !== '') { formatted = Object.assign({}, formatted, { 'vitals':sites.vitals }); }
  if(sites.mdreviews !== '') { formatted = Object.assign({}, formatted, { 'mdreviews':sites.mdreviews }); }
  if(sites.yellowpages !== '') { formatted = Object.assign({}, formatted, { 'yellowpages':sites.yellowpages }); }
  
  return formatted;
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
    
  const upsertAsync = Promise.promisify(chain.insert_or_replace, {context: chain});
  
  return yield upsertAsync(user);
};


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
      review_sites: formatReviewSites(data)
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
      review_sites: formatReviewSites(data)
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
      review_sites: formatReviewSites(data)
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
      review_sites: formatReviewSites(data)
    });
};

exports.deleteLocation = function* (id) {
  const chain = DynamoDB
    .table('locations')
    .where('id').eq(id);
    
  const deleteAsync = Promise.promisify(chain.delete, {context: chain});
  
  return yield deleteAsync();
};
