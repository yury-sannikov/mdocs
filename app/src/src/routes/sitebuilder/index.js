
import Router from 'koa-router';
import _ from 'lodash';

const debug = require('debug')('app:routes:sitebuilder');

const router = new Router({
  prefix: '/sitebuilder'
});

router.get('main', '/', function*() {
  this.render('sitebuilder/main', Object.assign({}, this.jadeLocals, {
  }), true);
});

module.exports = router;
