'use strict';
require('babel-polyfill');
require('source-map-support/register');
require('babel-register');
require('dotenv').config();

var app = require('./app')
var co = require('co');
var argv = require('minimist')(process.argv.slice(2));

if (argv._.length === 0) {
  console.error('Please specify selector');
  return -1;
}
var fn = app[argv._[0]];

if (!fn) {
  console.error('Unknown selector');
  return -2;
}

co(fn).then(function (value) {
  console.log(value);
}, function (err) {
  console.error(err.stack);
});
