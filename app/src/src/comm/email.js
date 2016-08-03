'use strict';
const pug = require('pug');
const Promise = require('bluebird');

const mailgun = require('mailgun-js')({
  apiKey: 'key-3a14af01b2a40eeec8630cf86cc0da26',
  domain: 'app.mdocs.co'});

const ROOT_PATH = './resources/reviewRequest';
const LOCATION_ROOT_PATH = './resources/reviewRequestLocation';
const NEGATIVE_REVIEW_ROOT_PATH = './resources/negativeReview';

exports.sendReviewRequest = function* (to, data) {
  var logoPng = `${ROOT_PATH}/logo.png`;
  var starsPng = `${ROOT_PATH}/stars.png`;
  
  var html = pug.renderFile(`${ROOT_PATH}/index.pug`, data);
  
  var message = {
    from: 'Patient Reviews by MDOCS <survey@app.mdocs.co>',
    to: to,
    subject: `Patient Review Invite`,
    html: html,
    inline: [logoPng, starsPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendLocationReviewRequest = function* (to, data) {
  var logoPng = `${LOCATION_ROOT_PATH}/logo.png`;
  var starsPng = `${LOCATION_ROOT_PATH}/stars.png`;
  
  var html = pug.renderFile(`${LOCATION_ROOT_PATH}/index.pug`, data);
  
  var message = {
    from: 'Patient Reviews by MDOCS <survey@app.mdocs.co>',
    to: to,
    subject: `Patient Review Invite`,
    html: html,
    inline: [logoPng, starsPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendNegativeReviewNotification = function* (to, data) {
  var logoPng = `${NEGATIVE_REVIEW_ROOT_PATH}/logo.png`;
  
  var html = pug.renderFile(`${NEGATIVE_REVIEW_ROOT_PATH}/index.pug`, data);
  
  var message = {
    from: 'Patient Reviews by MDOCS <survey@app.mdocs.co>',
    to: to,
    subject: `Negative Review Notification`,
    html: html,
    inline: [logoPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};
