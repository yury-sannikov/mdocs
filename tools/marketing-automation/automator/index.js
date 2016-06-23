'use strict';
console.log = console.dir = function() {
  throw Error('Do not use console.log & console.dir. Use console.error instead.');
}

require('babel-polyfill');
require('source-map-support/register');
require('babel-register');
//require('dotenv').config();
require('./app');
