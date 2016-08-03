// BASE SETUP

var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var q           = require('q');
var Lead        = require('./app/models/lead');
// var routes      = require('./app/routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

// Router middleware
router.use(function(req, res, next) {
  console.log('Routing in progress...');
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'MDOCS Marketing API' });
});

router.route('/leads')
  .post(function(req, res) {

    var lead = new Lead();
    lead.name = req.body.name;
    lead.email = req.body.email;

    lead.save(function(err) {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Lead created successfully.'});
    })
  })
  
  .get(function(req, res) {

    Lead.find(function(err, leads) {
      if (err) {
        res.send(err);
      }

      res.json(leads);
    });

  });

mongoose.Promise = q.Promise;
mongoose.connect('mongodb://root:Movel1Movel@ds139675.mlab.com:39675/mdocs-marketing');

app.use('/api', router);

app.listen(port);
console.log('Marketing server running on port ' + port);
