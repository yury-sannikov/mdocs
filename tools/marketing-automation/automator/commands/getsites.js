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
        if(!node.getAttribute('class').contains('noreviews')) {
          result.rating = parseFloat(node.textContent);
        }
      });
      $.q("//div[@class='child']/span[2]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent.replace(/\(/g, '').replace(/\)/g, ''));
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

var parseYelp$ = function (url) {
  var result = {
    "siteId": "Yelp",
    "siteName": "YELP.COM",
    "siteUrl": url,
    "addressAccurate": true,
    "reviewCount": 0,
    "rating": 0
  };

  return sp.load(url)
    .then(function($){

      $.q("//meta[@itemprop='ratingValue'][1]").forEach(function(node){
        result.rating = parseFloat(node.getAttribute('content'));
      });
      $.q("//span[@itemprop='reviewCount'][1]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent.split(' ')[0]);
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

var parseRateMDs$ = function (url) {
  var result = {
    "siteId": "RateMDs",
    "siteName": "RATEMDS.COM",
    "siteUrl": url,
    "addressAccurate": true,
    "reviewCount": 0,
    "rating": 0
  };

  return sp.load(url)
    .then(function($){

      $.q("//meta[@itemprop='ratingValue'][1]").forEach(function(node){
        result.rating = parseFloat(node.getAttribute('content'));
      });
      $.q("//span[@itemprop='ratingCount'][1]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent);
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

var parseYellowPages$ = function (url) {
  var result = {
    "siteId": "YellowPages",
    "siteName": "YELLOWPAGES.COM",
    "siteUrl": url,
    "addressAccurate": true,
    "reviewCount": 0,
    "rating": 0
  };

  return sp.load(url)
    .then(function($){

      $.q("//meta[@itemprop='ratingValue'][1]").forEach(function(node){
        result.rating = parseFloat(node.getAttribute('content'));
      });
      $.q("//span[@itemprop='reviewCount'][1]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent.replace(/\(/g, '').replace(/\)/g, ''));
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

var parseMerchantCircle$ = function (url) {
  var result = {
    "siteId": "MerchantCircle",
    "siteName": "MERCHANTCIRCLE.COM",
    "siteUrl": url,
    "addressAccurate": true,
    "reviewCount": 0,
    "rating": 0
  };

  return sp.load(url)
    .then(function($){

      $.q("//*[@id='business-aggregate-rating'][1]").forEach(function(node){
        result.rating = parseFloat(node.textContent);
      });
      $.q("//*[@class='bCount'][1]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent);
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

var parseYahooLocal$ = function (url) {
  var result = {
    "siteId": "Yahoo",
    "siteName": "LOCAL.YAHOO.COM",
    "siteUrl": url,
    "addressAccurate": true,
    "reviewCount": 0,
    "rating": 0
  };

  return sp.load(url)
    .then(function($){

      $.q("//div[@class='info-rating']/span[1]").forEach(function(node){
        result.rating = parseFloat(node.getAttribute('data-value'));
      });
      $.q("//div[@class='info-rating'][1]").forEach(function(node){
        result.reviewCount = parseFloat(node.textContent.split(' ')[0]);
      });
      return result;
    })
    .fail(function(err){
      console.error(err);
    });
}

// Getting ratings from each site
var index = 0;
function* process(dentist) {
  index++;

  var _uuid = uuid.v4();

  var initialData = {
    key: _uuid + '-' + dentist.name.split(' ')[0].toLowerCase() + '-' + dentist.name.split(' ')[1].toLowerCase().replace(',', ''),
    "uuid": _uuid,
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
        initialData.reviews.push(data);
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
        initialData.reviews.push(data);
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("Vitals URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  // Yelp.com
  var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'yelp';});
  if (vIndex > -1) {
    try {
        const data = yield parseYelp$(dentist.sites[vIndex].url);
        initialData.reviews.push(data);
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("Yelp URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  // RateMDs.com
  var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'ratemds';});
  if (vIndex > -1) {
    try {
        const data = yield parseRateMDs$(dentist.sites[vIndex].url);
        initialData.reviews.push(data);
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("RateMDs URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  // YellowPages.com
  var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'yellowpages';});
  if (vIndex > -1) {
    try {
        const data = yield parseYellowPages$(dentist.sites[vIndex].url);
        initialData.reviews.push(data);
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("YellowPages URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  // MerchantCircle.com
  var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'merchantcircle';});
  if (vIndex > -1) {
    try {
        const data = yield parseMerchantCircle$(dentist.sites[vIndex].url);
        initialData.reviews.push(data);
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("MerchantCircle URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  // Yahoo Local
  var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'yahoo';});
  if (vIndex > -1) {
    try {
        const data = yield parseYahooLocal$(dentist.sites[vIndex].url);
        initialData.reviews.push(data);
    } catch (e) {
        console.error(e.stack);
    }
  } else {
    console.error("Yahoo Local URL not found for record #: " + index + '   Name: ' + dentist.name);
  }

  return Object.assign({}, dentist, initialData);

}
