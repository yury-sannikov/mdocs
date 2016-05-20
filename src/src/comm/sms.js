'use strict';

const config = require('../config');
const Promise = require('bluebird');
const client = Promise.promisifyAll(require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN));
const debug = require('debug')('app:comm:sms');

exports.sendSMS = function* (to, text) {
  var num = to.replace(/[^0-9.]/g, '');
  
  if (num.indexOf('+1') != 0) {
    num = `+1${num}`;
  }
  
  debug(`Send SMS to ${num}, message: ${text}`);
  
  return yield client.sendMessageAsync({
    to: num,
    from: config.TWILIO_SMS_NUMBER,
    body: text
  });
};
