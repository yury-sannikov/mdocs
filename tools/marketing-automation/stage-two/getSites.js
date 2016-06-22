var fs = require('fs');
var _ = require('lodash');
var uuid = require('uuid');
var moment = require('moment');
var sp = require('scrapejs').init({
    cc: 2, // up to 2 concurrent requests 
    delay: 5 * 1 // delay 5 seconds before each request 
});
var restClient = require('node-rest-client');
var client = new restClient.Client(); 
var inputFile = './data/input/doctors-input.json';
var outputFile = 'doctors-output.json';
var d = JSON.parse(fs.readFileSync(inputFile, 'utf8'));


var parseHealthGrades = function (url, file) {
  var result = {
        "siteId": "HealthGrades",
        "siteName": "HEALTH GRADES",
        "siteUrl": url,
        "addressAccurate": true,
        "reviewCount": 0,
        "rating": 0
      };

  sp.load(url)
    .then(function($){
      $.q("//span[@itemprop='ratingValue'][1]").forEach(function(node){
        result.rating = node.textContent;
      });
      $.q("//a[@data-hgoname='survey-results'][1]").forEach(function(node){
        result.reviewCount = node.textContent.split(' ')[0];
      });

      var dentist = JSON.parse(fs.readFileSync(file, 'utf8'));

      // HealthGrades.com
      var hgIndex = _.findLastIndex(dentist.reviews, function(s) {return s.siteId == 'HealthGrades';});
      if (_.findLastIndex(dentist.reviews, function(s) {return s.siteId == 'HealthGrades';}) < 0) {
        // console.log("Attempting to parse HealthGrades for record #: " + index + '   Name: ' + dentist.name);
        try {
            dentist.reviews.push(result);
            fs.writeFile(file, JSON.stringify(dentist, null, 2), function (err) {
              if (err) return console.log(err);
            });
        } catch (e) {
            console.log(e);
        }
      } else {
        console.log("HealthGrades URL found for record #: " + index + '   Name: ' + dentist.name);
      }
  })
  .fail(function(err){
    console.log(err);
  })
}

var parseVitals = function (url, file) {
  var result = {
        "siteId": "Vitals",
        "siteName": "VITALS.COM",
        "siteUrl": url,
        "addressAccurate": true,
        "reviewCount": 0,
        "rating": 0
      };

  sp.load(url)    
    .then(function($){

      $.q("//div[@class='child']/span[1]").forEach(function(node){
        result.rating = node.textContent;
      });
      $.q("//a[@class='reviews_count']").forEach(function(node){
        result.reviewCount = node.textContent.split(' ')[0];
      });

      var dentist = JSON.parse(fs.readFileSync(file, 'utf8'));

      var vIndex = _.findLastIndex(dentist.reviews, function(s) {return s.siteId == 'Vitals';});
      if (_.findLastIndex(dentist.reviews, function(s) {return s.siteId == 'Vitals';}) < 0) {
        try {
            dentist.reviews.push(result);
            fs.writeFile(file, JSON.stringify(dentist, null, 2), function (err) {
              if (err) return console.log(err);
            });
        } catch (e) {
            console.log(e);
        }
      } else {
        console.log("Vitals URL found for record #: " + index + '   Name: ' + dentist.name);
      }
  })
  .fail(function(err){
    console.log(err);
  })
}

var index = 0;
_(d.providers).forEach(function(dentist) {
    index++;

    var _uuid = uuid.v4();
    var outputFile = './data/output/' + _uuid + '-' + dentist.name.split(' ')[0].toLowerCase() + '-' + dentist.name.split(' ')[1].toLowerCase().replace(',', '') + '.json';

    var initialData = {
      "reportDate": moment().format("MM/DD/YYYY"),
      "providerName": dentist.name,
      "providerAddress": dentist.address + ' ' + dentist.city + ', ' + dentist.state + ' ' + dentist.zip,
      "bias": 0,
      "reviews": []
    };

    fs.writeFile(outputFile, JSON.stringify(initialData, null, 2), function (err) {
      if (err) return console.log(err);
    });


    // HealthGrades.com
    var hgIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'healthgrades';});
    if (hgIndex > -1) {
      console.log("Attempting to parse HealthGrades for record #: " + index + '   Name: ' + dentist.name);
      try {
          parseHealthGrades(dentist.sites[hgIndex].url, outputFile);
      } catch (e) {
          console.log(e);
      }
    } else {
      console.log("HealthGrades URL not found for record #: " + index + '   Name: ' + dentist.name);
    }

    // Vitals.com
    var vIndex = _.findLastIndex(dentist.sites, function(s) {return s.site.toLowerCase() == 'vitals';});
    if (vIndex > -1) {
      console.log("Attempting to parse Vitals for record #: " + index + '   Name: ' + dentist.name);
      try {
          parseVitals(dentist.sites[vIndex].url, outputFile);
      } catch (e) {
          console.log(e);
      }
    } else {
      console.log("Vitals URL not found for record #: " + index + '   Name: ' + dentist.name);
    }

});
