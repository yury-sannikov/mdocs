
import Router from 'koa-router';
// import _ from 'lodash';
// import { Repo } from '../../sitebuilder';
// import { sitebuilderLocalsMiddleware } from './helpers';


const debug = require('debug')('app:routes:sitebuilder:preview:assets');

const router = new Router({
  prefix: '/assets'
})

router.get('/*', function*() {
  this.body = 'todo: return assets depenging on current session. ' + this.request.url
});

router.post('/*', function*() {
  this.body = 'todo: create new assets in a temporary folder'
});

router.put('/*', function*() {
  this.body = 'todo: update assets in a temporary folder'
});

router.delete('/*', function*() {
  this.body = 'todo: delete assets'
});

module.exports = router;
