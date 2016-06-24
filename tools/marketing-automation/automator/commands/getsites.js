var uuid = require('uuid');
var sp = require('scrapejs').init({
    cc: 2, // up to 2 concurrent requests
    delay: 5 * 1 // delay 5 seconds before each request
});
var restClient = require('node-rest-client');
var client = new restClient.Client();
var moment = require('moment');


import _ from 'co-lodash';
import cs from 'co-stream';
import JSONStream from 'JSONStream';

export function help() {
  return {
    name: 'getsited',
    description: 'Marketing Step 2: Get array of providers and return site URLs',
    options: [{
      key: '--selector',
      required: false,
      short: 'sel',
      description: 'JSON selector, for instance providers.* process each element in providers array'
    }]
  };
}

export function* execute(inputStream, params) {
  const { selector } = params;
  return inputStream
    .pipe(JSONStream.parse(selector || '*'))
    .pipe(cs.map(function* (data) {
      return yield process(data);
    },{ objectMode: true, parallel: 1 }));
}

var parseHealthGrades$ = function (url) {
  var result = {
        "siteId": "HealthGrades",
        "siteName": "HEALTH GRADES",
        "siteUrl": url,
        "addressAccurate": true,
        "reviewCount": 0,
        "rating": 0
      };

  return sp.load(url)
    .then(function($){
      $.q("//span[@itemprop='ratingValue'][1]").forEach(function(node){
        result.rating = parseFloat(node.textContent);
      });
      $.q("//a[@data-hgoname='survey-results'][1]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent.split(' ')[0]);
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

var parseVitals$ = function (url) {
  var result = {
        "siteId": "Vitals",
        "siteName": "VITALS.COM",
        "siteUrl": url,
        "addressAccurate": true,
        "reviewCount": 0,
        "rating": 0
      };

  return sp.load(url)
    .then(function($){

      $.q("//div[@class='child']/span[1]").forEach(function(node){
        result.rating = parseFloat(node.textContent);
      });
      $.q("//a[@class='reviews_count']").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent.split(' ')[0]);
      });
      return result;
  })
  .fail(function(err){
    console.error(err);
  })
}

var index = 0;
function* process(dentist) {
  index++;

  var _uuid = uuid.v4();

  var initialData = {
    key: _uuid + '-' + dentist.name.split(' ')[0].toLowerCase() + '-' + dentist.name.split(' ')[1].toLowerCase().replace(',', ''),
    "reportDate": moment().format("MM/DD/YYYY"),
    "providerName": dentist.name,
    "providerAddress": dentist.address + '<br>' + dentist.city + ', ' + dentist.state + ' ' + dentist.zip + '<br>' + dentist.phone,
    "bias": 0,
    "reviews": []
  };

  // HealthGrades.com
  var hgIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'healthgrades';});
  if (hgIndex > -1) {
    try {
        const data = yield parseHealthGrades$(dentist.sites[hgIndex].url);
        initialData.reviews.push(data)
    } catch (e) {
      console.error(e.stack);
    }
  } else {
    console.error("HealthGrades URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  // Vitals.com
  var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'vitals';});
  if (vIndex > -1) {
    try {
        const data = yield parseVitals$(dentist.sites[vIndex].url);
        initialData.reviews.push(data)
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("Vitals URL not found for record #: " + index + '   Name: ' + dentist.name);
  }
  return Object.assign({}, dentist, initialData);

}
