var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;

var LeadSchema  = new Schema({
  name: String,
  email: String
});

module.exports  = mongoose.model('Lead', LeadSchema);
