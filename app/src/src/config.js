'use strict';
const https = require('https');
const AWS = require('aws-sdk');
const debug = require('debug')('app:config');

// Ensure require('dotenv').config() is run before this module is required

exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.PORT = Number.parseInt(process.env.PORT, 10) || 3030;

// If true, then Koa will trust the X-Forwarded-Host header
// For example, use this if you're behind Cloudflare
//
// https://github.com/koajs/koa/blob/f875eb0c3077105391d16c44c1a9e3f6924791d2/docs/api/request.md#requesthost
exports.TRUST_PROXY = process.env.TRUST_PROXY === 'true';

// Set the HOSTNAME in production for basic CSRF prevention
//
// Ex: example.com, subdomain.example.com
exports.APP_HOSTNAME = process.env.APP_HOSTNAME;
if (!exports.APP_HOSTNAME) {
  console.warn('Warn: CSRF checks are disabled since there is no APP_HOSTNAME environment variable provided');
}

exports.RECAPTCHA_SITEKEY = process.env.RECAPTCHA_SITEKEY;
exports.RECAPTCHA_SITESECRET = process.env.RECAPTCHA_SITESECRET;
if (!exports.RECAPTCHA_SITEKEY)
  console.warn('Warn: Recaptcha will not work since RECAPTCHA_SITEKEY is not set');
if (!exports.RECAPTCHA_SITESECRET)
  console.warn('Warn: Recaptcha will not work since RECAPTCHA_SITESECRET is not set');

exports.RECAPTCHA_SYSTEM_ONLINE = !!(exports.RECAPTCHA_SITEKEY && exports.RECAPTCHA_SITESECRET);
if (exports.RECAPTCHA_SYSTEM_ONLINE) {
  debug('Recaptcha system online');
} else {
  debug('Warn: Recaptcha system offline');
}

exports.MESSAGES_PER_PAGE = Number.parseInt(process.env.MESSAGES_PER_PAGE, 10) || 10;
exports.USERS_PER_PAGE = Number.parseInt(process.env.USERS_PER_PAGE, 10) || 10;

exports.AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
exports.AUTH_CLIENT_NAMESPACE = process.env.AUTH_CLIENT_NAMESPACE;
exports.AUTH_CALLBACK_URL = process.env.AUTH_CALLBACK_URL || '/callback';

exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.AWS_REGION = process.env.AWS_REGION;

exports.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
exports.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
exports.TWILIO_SMS_NUMBER = process.env.TWILIO_SMS_NUMBER;

exports.BITLY_CLIENT_ID = process.env.BITLY_CLIENT_ID;
exports.BITLY_CLIENT_SECRET = process.env.BITLY_CLIENT_SECRET;
exports.BITLY_TOKEN = process.env.BITLY_TOKEN;

exports.SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
exports.SLACK_MARKETING_WEBHOOK_URL = process.env.SLACK_MARKETING_WEBHOOK_URL;

exports.AUTH_API_JWT = process.env.AUTH_API_JWT;

exports.STRIPE_PUB_KEY = process.env.STRIPE_PUB_KEY;
exports.STRIPE_SEC_KEY = process.env.STRIPE_SEC_KEY;
////////////////////////////////////////////////////////////

// DynamoDB workaround
const httpOptions = {
  agent: new https.Agent({
    ciphers: 'ALL',
    secureProtocol: 'TLSv1_method'
  })
};

// Set AWS sdk config
AWS.config.update({
  httpOptions: httpOptions,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});


debug(`Running in ${exports.NODE_ENV} mode.`);
// Output config object in development to help with sanity-checking
if (exports.NODE_ENV === 'development' || exports.NODE_ENV === 'test') {
  debug(exports);
}
