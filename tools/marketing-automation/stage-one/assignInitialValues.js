var fs = require('fs');
var uuid = require('uuid');
var moment = require('moment');

var fileName = 'input.json';

var data = JSON.parse(fs.readFileSync(fileName, 'utf8'));

data.providers.forEach(function(doc) {
  if (!doc.hasOwnProperty('uuid')) {
    doc.uuid = uuid.v4();
  }
  if (!doc.hasOwnProperty('key')) {
    doc.key = doc.uuid + '-' + doc.name.split(' ')[0].toLowerCase() + '-' + doc.name.split(' ')[1].toLowerCase().replace(',', '');
  }
  if (!doc.hasOwnProperty('bias')) {
    doc.bias = 0;
  }
  if (!doc.hasOwnProperty('reportDate')) {
    doc.reportDate = moment().format("MM/DD/YYYY");
  }
  if (!doc.hasOwnProperty('providerName')) {
    doc.providerName = doc.name;
  }
  if (!doc.hasOwnProperty('reviews')) {
    doc.reviews = [];
  }
});

fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
  if (err) throw err;
});
