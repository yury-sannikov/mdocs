var fs = require('fs');
var _ = require('lodash');
var inputFile = './index.html';
var dir = fs.readdirSync('./data');

_(dir).forEach(function(f) {
  fs.createReadStream(inputFile).pipe(fs.createWriteStream(f.split('.')[0]+ '.html'));
});
