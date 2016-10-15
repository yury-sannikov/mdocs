'use strict';
const pug = require('pug');
const Promise = require('bluebird');
const moment = require('moment');
import {formatCents} from '../belt';

const mailgun = require('mailgun-js')({
  apiKey: 'key-3a14af01b2a40eeec8630cf86cc0da26',
  domain: 'app.mdocs.co'});

const ROOT_PATH = './resources/reviewRequest';
const LOCATION_ROOT_PATH = './resources/reviewRequestLocation';
const NEGATIVE_REVIEW_ROOT_PATH = './resources/negativeReview';
const APPOINTMENT_ROOT_PATH = './resources/appointmentNotification';
const APPOINTMENT_PATIENT_ROOT_PATH = './resources/appointmentNotificationPatient';

exports.sendReviewRequest = function* (to, data) {
  var logoPng = `${ROOT_PATH}/logo.png`;
  var starsPng = `${ROOT_PATH}/stars.png`;

  var html = pug.renderFile(`${ROOT_PATH}/index.pug`, data);

  var message = {
    from: 'PracticeWin <survey@app.mdocs.co>',
    to: to,
    subject: `Patient Survey - ${data.title}`,
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
    from: 'PracticeWin <survey@app.mdocs.co>',
    to: to,
    subject: `Patient Survey - ${data.title}`,
    html: html,
    inline: [logoPng, starsPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendReviewNotification = function* (to, data, isPositive) {
  var logoPng = `${NEGATIVE_REVIEW_ROOT_PATH}/logo.png`;

  var html = pug.renderFile(`${NEGATIVE_REVIEW_ROOT_PATH}/index.pug`, Object.assign({}, data, {
    positiveText: isPositive ? 'positive' : 'negative',
    positiveTextUpper: isPositive ? 'Positive' : 'Negative'
  }));

  const positiveText = isPositive ? 'Positive' : 'Negative'

  var message = {
    from: 'PracticeWin <survey@app.mdocs.co>',
    to: to,
    subject: `${positiveText} Review Notification`,
    html: html,
    inline: [logoPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendPlanChange = function* (to, data) {
  const upcomingSub = data.currentSubscription.customer.subscriptions.data[0];
  let newQuantity;
  if(data.action === 'delete') {
    newQuantity = upcomingSub.quantity - 1;
  }
  else if(data.action === 'create') {
    newQuantity = upcomingSub.quantity + 1;
  }
  else {
    console.error('Wrong data passed in!!!!!!!!!')
    newQuantity = upcomingSub.quantity;
  }

  var html = `<div><h4>Your plan has been updated. You have ${data.message}.</h4><br/>`
      + `<h4>Your previous upcoming cycle payment was:</h4>`
      + `<h4><strong>${formatCents(upcomingSub.plan.amount)}</strong> per <strong>${upcomingSub.plan.interval}</strong> for <strong>${upcomingSub.quantity}</strong> subscriptions. Total <strong>${formatCents(upcomingSub.plan.amount * upcomingSub.quantity)}</strong> at <strong>${moment(data.futureInvoice.date * 1000).format('MMMM Do YYYY')}</strong></h4><br/>`
      + `<h4>Your updated upcoming cycle payment is:</h4>`
      + `<h4><strong>${formatCents(upcomingSub.plan.amount)}</strong> per <strong>${upcomingSub.plan.interval}</strong> for <strong>${newQuantity}</strong> subscriptions. Total <strong>${formatCents(upcomingSub.plan.amount * newQuantity)}</strong> at <strong>${moment(data.futureInvoice.date * 1000).format('MMMM Do YYYY')}</strong></h4></div>`;

  var message = {
    from: 'PracticeWin <survey@app.mdocs.co>',
    to: to,
    subject: `Subscription Updated`,
    html: html
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendSubscriptionCancel = function* (to, data) {
  var html = 'You have cancelled your subscription. Your account is now frozen and you can no longer send and view PracticeWin, nor can you create/edit profiles.';

  var message = {
    from: 'PracticeWin <survey@app.mdocs.co>',
    to: to,
    subject: `Subscription Cancelled`,
    html: html
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendAppointmentEmail = function* (to, data) {
  var logoPng = `${APPOINTMENT_ROOT_PATH}/logo.png`;

  var html = pug.renderFile(`${APPOINTMENT_ROOT_PATH}/index.pug`, data);

  var message = {
    from: 'PracticeWin <info@app.mdocs.co>',
    to: to,
    subject: data.subject,
    html: html,
    inline: [logoPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};

exports.sendAppointmentEmailPatient = function* (to, data) {
  var logoPng = `${APPOINTMENT_PATIENT_ROOT_PATH}/logo.png`;

  var html = pug.renderFile(`${APPOINTMENT_PATIENT_ROOT_PATH}/index.pug`, data);

  var message = {
    from: 'PracticeWin <info@app.mdocs.co>',
    to: to,
    subject: `New Appointment Request`,
    html: html,
    inline: [logoPng]
  };
  const messages = mailgun.messages();
  const sendAsync =  Promise.promisify(messages.send, {context: messages});
  return yield sendAsync(message);
};
