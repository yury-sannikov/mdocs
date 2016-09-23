var express     = require('express');
var router      = express.Router();
var Lead        = require('./models/lead');

// Router middleware
router.use(function(req, res, next) {
  console.log('API call in progress...');
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

router.route('/leads/:lead_id')
  .get(function(req, res) {
    Lead.findById(req.params.lead_id, function(err, lead) {
      if (err) {
        res.send(err);
      }

      res.json(lead);
    });
  })

  .put(function(req, res) {
    Lead.findById(req.params.lead_id, function(err, lead) {
      if (err) {
        res.send(err);
      }

      lead.name = req.body.name;
      lead.email = req.body.email;

      lead.save(function(err) {
        if (err) {
          res.send(err);
        }

        res.json({ message: 'Lead updated successfully.'});
      })
    })
  })

  .delete(function(req, res) {
    Lead.remove({
      _id: req.params.lead_id
    }, function(err, lead) {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Lead deleted successfully.'});
    })
  })
;

module.exports = router;
