var fs = require('fs');
var uuid = require('uuid');

var fileName = 'doctors.json';

var data = JSON.parse(fs.readFileSync(fileName, 'utf8'));

data.providers.forEach(function(doc) {
  if (!doc.hasOwnProperty('uuid')) {
    doc.uuid = uuid.v4();
  }
});

fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
  if (err) throw err;
});
