
import Router from 'koa-router';
// import _ from 'lodash';
// import { Repo } from '../../sitebuilder';
// import { sitebuilderLocalsMiddleware } from './helpers';


const debug = require('debug')('app:routes:sitebuilder:preview');

const router = new Router({
  prefix: '/sitebuilderpreview'
})

router.use(require('./assets').routes())

router.get('main', '/', function*() {
  this.body = {text: 'preview'}
});

router.post('/auth', function*() {
  this.body = {token: this.request.body.token};
})

module.exports = router;
