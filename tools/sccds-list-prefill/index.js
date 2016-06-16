'use strict';
require('babel-polyfill');
require('source-map-support/register');
require('babel-register');
require('dotenv').config();

var app = require('./app')
var co = require('co');
co(app.default).then(function (value) {
  console.log(value);
}, function (err) {
  console.error(err.stack);
});
