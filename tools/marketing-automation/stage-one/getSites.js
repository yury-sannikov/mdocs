var fs = require('fs');
var req = require('request-promise');
var _ = require('lodash');
var sp = require('scrapejs').init({
	cc: 2, // up to 2 concurrent requests 
	delay: 5 * 100 // delay 5 seconds before each request 
});

// levent@movel.co Keys
// var googleSearchKey = 'AIzaSyC0e8rdDoTo4CjrInzYP-HMhBLqYNR_wFs';

// levent.gurses@64clicks.com Keys
var googleSearchKey = 'AIzaSyAh4GFdzf9pktMpDJCKa1rrxaKiFroZjjM';
var healthGradesCxKey = '009344016812831918064:e3zkekpedge';
var yelpCxKey = '009344016812831918064:pw3fojj8rmi';

var Client = require('node-rest-client').Client; 
var client = new Client();

var fileName = 'doctors.json';
var d = JSON.parse(fs.readFileSync(fileName, 'utf8'));

// Base URL links
var hgBaseSearchUrl = 'https://www.healthgrades.com/provider-search-directory/search?q=';
var vitalsBaseSearchUrl = 'http://www.vitals.com/search?type=name&provider_type=0&q=';
var yelpBaseSearchUrl = 'http://www.yelp.com/search?find_desc=';
var rateMDsBaseSearchUrl = 'https://www.ratemds.com/best-doctors/?text=';
var ypBaseSearchUrl = 'http://www.yellowpages.com/search?search_terms=';
var mcBaseSearchUrl = 'http://www.merchantcircle.com/search?q=';
var yahooBaseSearchUrl = 'https://search.yahoo.com/local/?p=';
var googleBaseSearchUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=';

// Used API Keys
var googleAPIKey = 'AIzaSyAMlBXqOQ_Ugk36ttc95Nc9hNnECfQghJY';


// Generating actual URL links
var generateHealthGradesUrl = function(q, loc) {
	return hgBaseSearchUrl + q + '&loc=' + loc;
}

var generateVitalsSearchUrl = function(q) {
	return vitalsBaseSearchUrl + q;
}

var generateYelpSearchUrl = function(q, loc) {
	return yelpBaseSearchUrl + q + '&find_loc=' + loc;
}

var generateRateMDsSearchUrl = function(q) {
	return rateMDsBaseSearchUrl + q;
}

var generateYPSearchUrl = function(q, loc) {
  return ypBaseSearchUrl + q + '&geo_location_terms=' + loc;
}

var generateMCSearchUrl = function(q, loc) {
  return mcBaseSearchUrl + q + '&qn=' + loc;
}

var generateYahooSearchUrl = function(q, loc) {
  return yahooBaseSearchUrl + q + '&addr=' + loc;
}

var generateGoogleSearchUrl = function(q) {
  return googleBaseSearchUrl + q + '&key=' + googleAPIKey;
}

// Parsing the links
var parseHealthGrades = function (dentist) {
  url = generateHealthGradesUrl(dentist.name, dentist.zip);

	sp.load(url)
		.then(function($){
			$.q("//h2/a[@data-hgoname='psr-natural-result-provider-name'][1]").forEach(function(node){
				var res = {
					title: node.textContent,
					url: node.x("./@href")
				}

				if (_.findLastIndex(dentist.sites, function(s) { 
					return s.site == 'HealthGrades'; 
				}) >= 0) {
					console.log("HealthGrades URL found.");
					dentist.sites[0].site = 'HealthGrades';
					dentist.sites[0].title = node.textContent;
					dentist.sites[0].url = node.x("./@href");
				} else {
					console.log("Adding HealthGrades URL: " + url);
					dentist.sites.push(
						{
							"site": 'HealthGrades',
							"title": node.textContent,
							"url" : node.x("./@href")
						});
				}

  			fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
  			  if (err) return console.log(err);
  			});
  		});
  	})
  	.fail(function(err){
  		console.log(err);
  	});
}

var parseVitals = function (dentist) {
	var denName = dentist.name.split(',')[0];
	var url = generateVitalsSearchUrl(denName);
	
	sp.load(url)
		.then(function($){
			$.q("//div[@class='serplist-listing-title']/a[1]").forEach(function(node){
				var res = {
					title: node.textContent,
					url: node.x("./@href")
				}

				if (_.findLastIndex(dentist.sites, function(s) { 
					return s.site == 'Vitals'; 
				}) >= 0) {
					console.log("Vitals URL found.");
					dentist.sites[0].site = 'Vitals';
					dentist.sites[0].title = node.textContent.replace(/\t/g, "").replace(/\n/g, "");
					dentist.sites[0].url = node.x("./@href");
				} else {
					console.log("Adding Vitals URL: " + url);
					dentist.sites.push(
						{
							"site": 'Vitals',
							"title": node.textContent.replace(/\t/g, "").replace(/\n/g, ""),
							"url" : node.x("./@href")
						});
				}

  			fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
  			  if (err) return console.log(err);
  			});
  		});
  	})
  	.fail(function(err){
  		console.log(err);
  	});
}

var parseYelp = function (dentist) {
	var url = generateYelpSearchUrl(dentist.name, dentist.zip);

	sp.load(url)
		.then(function($){
			$.q("//span[@class='indexed-biz-name']/a[1]").forEach(function(node){
				var res = {
					title: node.textContent,
					url: node.x("./@href")
				}

				if (_.findLastIndex(dentist.sites, function(s) { 
					return s.site == 'Yelp'; 
				}) >= 0) {
					console.log("Yelp URL found.");
					dentist.sites[0].site = 'Yelp';
					dentist.sites[0].title = node.textContent.replace(/\t/g, "").replace(/\n/g, "");
					dentist.sites[0].url = node.x("./@href");
				} else {
					console.log("Adding Yelp URL: " + url);
					dentist.sites.push(
						{
							"site": 'Yelp',
							"title": node.textContent.replace(/\t/g, "").replace(/\n/g, ""),
							"url" : node.x("./@href")
						});
				}

  			fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
  			  if (err) return console.log(err);
  			});
  		});
  	})
  	.fail(function(err){
  		console.log(err);
  	});
}

var parseRateMDs = function (dentist) {
  var denName = dentist.name.split(',')[0];
	var url = generateRateMDsSearchUrl(denName);

	sp.load(url)
		.then(function($){
			$.q("//h2[@class='search-item-doctor-name']/a[1]").forEach(function(node){
				var res = {
					title: node.textContent,
					url: node.x("./@href")
				}

				if (_.findLastIndex(dentist.sites, function(s) { 
					return s.site == 'RateMDs'; 
				}) >= 0) {
					console.log("RateMDs URL found.");
					dentist.sites[0].site = 'RateMDs';
					dentist.sites[0].title = node.textContent.replace(/\t/g, "").replace(/\n/g, "");
					dentist.sites[0].url = node.x("./@href");
				} else {
					console.log("Adding RateMDs URL: " + url);
					dentist.sites.push(
						{
							"site": 'RateMDs',
							"title": node.textContent.replace(/\t/g, "").replace(/\n/g, ""),
							"url" : node.x("./@href")
						});
				}

  			fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
  			  if (err) return console.log(err);
  			});
  		});
  	})
  	.fail(function(err){
  		console.log(err);
  	});
}

var parseYellowPages = function (dentist) {
  var url = generateYPSearchUrl(dentist.name, dentist.zip);

  sp.load(url)
    .then(function($){
      $.q("//div[@class='v-card']/div[@class='info']/h3[@class='n']/a[@class='business-name'][1]").forEach(function(node){
        var res = {
          title: node.textContent,
          url: node.x("./@href")
        }

        if (_.findLastIndex(dentist.sites, function(s) { 
          return s.site == 'YellowPages'; 
        }) >= 0) {
          console.log("YellowPages URL found.");
          dentist.sites[0].site = 'YellowPages';
          dentist.sites[0].title = node.textContent.replace(/\t/g, "").replace(/\n/g, "");
          dentist.sites[0].url = node.x("./@href");
        } else {
          console.log("Adding YellowPages URL: " + url);
          dentist.sites.push(
            {
              "site": 'YellowPages',
              "title": node.textContent.replace(/\t/g, "").replace(/\n/g, ""),
              "url" : node.x("./@href")
            });
        }

        fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
          if (err) return console.log(err);
        });
      });
    })
    .fail(function(err){
      console.log(err);
    });
}

var parseMerchantCircle = function (dentist) {
  var url = generateMCSearchUrl(dentist.name, dentist.zip);

  sp.load(url)
    .then(function($){
      $.q("//*[@class='title'][1]").forEach(function(node){
        var res = {
          title: node.textContent.replace(/\t/g, "").replace(/\n/g, "").replace(/[0-9]+.[0-9]+/g, ""),
          url: node.x("./@href")
        }

        if (_.findLastIndex(dentist.sites, function(s) { 
          return s.site == 'MerchantCircle'; 
        }) >= 0) {
          console.log("MerchantCircle URL found.");
          dentist.sites[0].site = 'MerchantCircle';
          dentist.sites[0].title = node.textContent.replace(/\t/g, "").replace(/\n/g, "").replace(/[0-9]+.[0-9]+/g, "");
          dentist.sites[0].url = node.x("./@href");
        } else {
          console.log("Adding MerchantCircle URL: " + url);
          dentist.sites.push(
            {
              "site": 'MerchantCircle',
              "title": node.textContent.replace(/\t/g, "").replace(/\n/g, "").replace(/[0-9]+.[0-9]+/g, ""),
              "url" : node.x("./@href")
            });
        }

        fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
          if (err) return console.log(err);
        });
      });
    })
    .fail(function(err){
      console.log(err);
    });
}

var parseYahooLocal = function (dentist) {
  var url = generateYahooSearchUrl(dentist.name, dentist.zip);
  
  sp.load(url)
    .then(function($){
      // Single result
      var parseTry = $.q("//div[@id='local-algo-wrapper']/div/div/div[2]/a[1]");
      if(parseTry.length === 0) {
        // Multiple results -> grab first one
        parseTry = $.q("//div[@id='local-algo-wrapper']/div[@id='local-algo-listing']/ol/li/div/div/div/h4/a[1]");
      }

      parseTry.forEach(function(node){
        var res = {
          title: node.textContent,
          url: node.x("./@href")
        }

        if (_.findLastIndex(dentist.sites, function(s) { 
          return s.site == 'Yahoo'; 
        }) >= 0) {
          console.log("Yahoo Local URL found.");
          dentist.sites[0].site = 'Yahoo';
          dentist.sites[0].title = node.textContent.replace(/\t/g, "").replace(/\n/g, "");
          dentist.sites[0].url = node.x("./@href");
        } else {
          console.log("Adding Yahoo Local URL: " + url);
          dentist.sites.push(
            {
              "site": 'Yahoo',
              "title": node.textContent.replace(/\t/g, "").replace(/\n/g, ""),
              "url" : node.x("./@href")
            });
        }

        fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
          if (err) return console.log(err);
        });
      });
    })
    .fail(function(err){
      console.log(err);
    });
}

var parseGoogle = function (dentist) {
  var url = generateGoogleSearchUrl(dentist.name);
  
  req(url)
    .then(function(result){
      result = JSON.parse(result);

      switch(result.status) {
        case 'ZERO_RESULTS':    
          console.log("ZERO_RESULTS: " + dentist.name);
          break;
        case 'OK':
          if(!_.isEmpty(result.results)) {
            if (_.findLastIndex(dentist.sites, function(s) { 
              return s.site == 'Google'; 
            }) >= 0) {
              console.log("Google information found.");
              dentist.sites[0].site = 'Google';
              dentist.sites[0].title = result.results[0].name;
              dentist.sites[0].place_id = result.results[0].place_id;
              dentist.sites[0].url = result.results[0].url;
            } else {
              console.log("Adding Google information: " + url);
              dentist.sites.push(
                {
                  "site": 'Google',
                  "title": result.results[0].name,
                  "place_id" : result.results[0].place_id,
                  "url": url
                });
            }

            fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
              if (err) return console.log(err);
            });
            }
          break;
        default: 
            console.log(result.status + ': ' + dentist.name);
            break;
      }
    })
    .catch(function (err) {
        console.error(err + "\n" + dentist.name);
    });
}

// Getting data for each doctor
var index = 0;
_(d.providers).forEach(function(dentist) {
	index++;

	// HealthGrades.com
	if (_.findLastIndex(dentist.sites, function(s) { 
		return s.site == 'HealthGrades'; 
	}) < 0) {
		console.log("Attempting to parse HealthGrades for record #: " + index + '   Name: ' + dentist.name);
		try {
			parseHealthGrades(dentist);
		} catch (e) {
			console.log(e);
		}
	}

	// Vitals.com
	if (_.findLastIndex(dentist.sites, function(s) { 
		return s.site == 'Vitals'; 
	}) < 0) {
		console.log("Attempting to parse Vitals for record #: " + index + '   Name: ' + dentist.name);
		try {
			parseVitals(dentist);
		} catch (e) {
			console.log(e);
		}
	}

	// Yelp.com
	if (_.findLastIndex(dentist.sites, function(s) { 
		return s.site == 'Yelp'; 
	}) < 0) {
		console.log("Attempting to parse Yelp for record #: " + index + '   Name: ' + dentist.name);
		try {
			parseYelp(dentist);
		} catch (e) {
			console.log(e);
		}
	}

	// RateMDs.com
	if (_.findLastIndex(dentist.sites, function(s) { 
		return s.site == 'RateMDs'; 
	}) < 0) {
		console.log("Attempting to parse RateMDs for record #: " + index + '   Name: ' + dentist.name);
		try {
			parseRateMDs(dentist);
		} catch (e) {
			console.log(e);
		}
	}

  // Yellow Pages
  if (_.findLastIndex(dentist.sites, function(s) { 
   return s.site == 'YellowPages'; 
  }) < 0) {
    console.log("Attempting to parse YellowPages for record #: " + index + '   Name: ' + dentist.name);
    try {
      parseYellowPages(dentist);
    } catch (e) {
      console.log(e);
    }
  }

  // Merchant Circle
  if (_.findLastIndex(dentist.sites, function(s) { 
   return s.site == 'MerchantCircle'; 
  }) < 0) {
    console.log("Attempting to parse Merchant Circle for record #: " + index + '   Name: ' + dentist.name);
    try {
      parseMerchantCircle(dentist);
    } catch (e) {
      console.log(e);
    }
  }

  // Yahoo Local
  if (_.findLastIndex(dentist.sites, function(s) { 
   return s.site == 'Yahoo'; 
  }) < 0) {
    console.log("Attempting to parse Yahoo Local for record #: " + index + '   Name: ' + dentist.name);
    try {
      parseYahooLocal(dentist);
    } catch (e) {
      console.log(e);
    }
  }

  // Google
  if (_.findLastIndex(dentist.sites, function(s) { 
   return s.site == 'Google'; 
  }) < 0) {
    console.log("Attempting to parse Google for record #: " + index + '   Name: ' + dentist.name);
    try {
      parseGoogle(dentist);
    } catch (e) {
      console.log(e);
    }
  }

});

