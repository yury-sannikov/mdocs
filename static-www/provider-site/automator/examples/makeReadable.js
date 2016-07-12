var fs = require('fs');

var fileName = process.argv[2];

var data = JSON.parse(fs.readFileSync(fileName, 'utf8'));

fs.writeFile(fileName, JSON.stringify(data, null, 2), (err) => {
    if (err) throw err;
  });
