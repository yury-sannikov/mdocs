var express     = require('express');
var router      = express.Router();

// Router middleware
router.use(function(req, res, next) {
  console.log('Static view routing in progress...');
  next();
});

router.get('/', function (req, res) {
  res.render('index', { title: 'MDOCS: Diagnose Your Practice', message: 'Hello there, practices!'});
});

module.exports = router;
