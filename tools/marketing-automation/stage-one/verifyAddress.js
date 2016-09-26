var fs = require('fs');
var _ = require('lodash');
var Lob = require('lob')('test_eab69d773d53bca665a97886e3aa5c87a45');

var fileName = 'input.json';
var d = JSON.parse(fs.readFileSync(fileName, 'utf8'));

var index = 0;
_(d.providers).forEach(function(provider) {
  index++;
  
  // Verify address
  Lob.verification.verify({
    address_line1: provider.address,
    address_city: provider.city,
    address_state: provider.state,
    address_zip: provider.zip,
  }, function (err, res) {
    if (!err) {
      provider.address = res.address.address_line1;
      provider.address2 = res.address.address_line2;
      provider.city = res.address.address_city;
      provider.state = res.address.address_state;
      provider.zip = res.address.address_zip;
      provider.country = res.address.address_country;

      fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
        if (err) return console.log(err);
      });
      // console.log(provider);
    } else {
      console.log("Error: " + err);
    }
  });

});
