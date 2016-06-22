var fs = require('fs');
var _ = require('lodash');
var Lob = require('lob')('test_eab69d773d53bca665a97886e3aa5c87a45');

var fileName = 'doctors.json';
var d = JSON.parse(fs.readFileSync(fileName, 'utf8'));

var index = 0;
_(d.providers).forEach(function(dentist) {
  index++;
  
  // Verify address
  Lob.verification.verify({
    address_line1: dentist.address,
    address_city: dentist.city,
    address_state: dentist.state,
    address_zip: dentist.zip,
  }, function (err, res) {
    if (!err) {
      dentist.address = res.address.address_line1;
      dentist.address2 = res.address.address_line2;
      dentist.city = res.address.address_city;
      dentist.state = res.address.address_state;
      dentist.zip = res.address.address_zip;
      dentist.country = res.address.address_country;

      fs.writeFile(fileName, JSON.stringify(d, null, 2), function (err) {
        if (err) return console.log(err);
      });
      // console.log(dentist);
    } else {
      console.log("Error: " + err);
    }
  });

});
