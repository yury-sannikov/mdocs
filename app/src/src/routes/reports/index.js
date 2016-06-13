'use strict';
const Router = require('koa-router');
import { sendEmailTrackingToSlack } from '../../comm';

const router = new Router({
  prefix: '/reports'
});

router.get('/', function* () {
  this.render('reportCard/landing', this.jadeLocals, true);
});

module.exports = router;
