'use strict';
const https = require('https');
const AWS = require('aws-sdk');
const debug = require('debug')('app:config');

exports.NODE_ENV = process.env.NODE_ENV || 'development';
exports.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
exports.AWS_REGION = process.env.AWS_REGION;
exports.YELP_CONSUMER_KEY = process.env.YELP_CONSUMER_KEY;
exports.YELP_CONSUMER_SECRET = process.env.YELP_CONSUMER_SECRET;
exports.YELP_TOKEN = process.env.YELP_TOKEN;
exports.YELP_TOKEN_SECRET = process.env.YELP_TOKEN_SECRET;


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

