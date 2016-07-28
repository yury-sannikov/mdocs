
import Router from 'koa-router';
// import _ from 'lodash';
// import { Repo } from '../../sitebuilder';
// import { sitebuilderLocalsMiddleware } from './helpers';


const debug = require('debug')('app:routes:sitebuilder:preview');

const router = new Router({
  prefix: '/preview'
})

router.get('main', '/', function*() {
  this.body = {text: 'preview'}
});

module.exports = router;
