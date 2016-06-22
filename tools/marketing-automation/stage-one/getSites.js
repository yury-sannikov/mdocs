var fs = require('fs');
var _ = require('lodash');
var cheerio = require('cheerio');
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
var googleBaseSearchUrl = 'https://www.googleapis.com/customsearch/v1?q=';

var Client = require('node-rest-client').Client; 
var client = new Client();

var fileName = 'doctors.json';
var d = JSON.parse(fs.readFileSync(fileName, 'utf8'));

var hgBaseSearchUrl = 'https://www.healthgrades.com/provider-search-directory/search?q=';
var vitalsBaseSearchUrl = 'http://www.vitals.com/search?type=name&provider_type=0&q=';
var yelpBaseSearchUrl = 'http://www.yelp.com/search?find_desc=';
var rateMDsBaseSearchUrl = 'https://www.ratemds.com/best-doctors/?text=';

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

// var generateYelpUrl = function(query) {
// 	return googleBaseSearchUrl + query + '&cx=' + yelpCxKey + '&num=5&key=' + googleSearchKey;
// }

var parseHealthGrades = function (dentist) {
	sp.load(generateHealthGradesUrl(dentist.name, dentist.zip))
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
					console.log("Adding HealthGrades URL.");
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
		})
	})
	.fail(function(err){
		console.log(err);
	})
}

var parseVitals = function (dentist) {
	var denName = dentist.name.split(',')[0];
	var url = generateVitalsSearchUrl(denName);
	console.log(url);

	sp.load(url)
		.then(function($){
			$.q("//div[@class='serplist-listing-title']/a[1]").forEach(function(node){
				console.log('found');
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
					console.log("Adding Vitals URL.");
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
		})
	})
	.fail(function(err){
		console.log(err);
	})
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
		})
	})
	.fail(function(err){
		console.log(err);
	})
}

var parseRateMDs = function (dentist) {
	var url = generateRateMDsSearchUrl(dentist.name);
	console.log(url);
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
		})
	})
	.fail(function(err){
		console.log(err);
	})
}

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
	} else {
	
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
	} else {

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
	} else {

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
	} else {

	}
});

