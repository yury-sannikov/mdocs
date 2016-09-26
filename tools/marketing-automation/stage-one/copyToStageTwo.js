var fs = require('fs');

var fileInputName = 'input.json';
var fileOutputName = '../automator/examples/doctors-input-s2.json';

var data = JSON.parse(fs.readFileSync(fileInputName, 'utf8'));

fs.writeFile(fileOutputName, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
  });
