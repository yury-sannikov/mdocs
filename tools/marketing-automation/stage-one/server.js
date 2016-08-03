// BASE SETUP

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var q           = require('q');
var router      = require('./app/routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

mongoose.Promise = q.Promise;
mongoose.connect('mongodb://root:Movel1Movel@ds139675.mlab.com:39675/mdocs-marketing');

app.use('/api', router);

app.listen(port);
console.log('Marketing server running on port ' + port);
