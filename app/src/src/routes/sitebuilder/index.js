
import Router from 'koa-router';
import _ from 'lodash';
import { Repo } from '../../sitebuilder';
import { sitebuilderLocalsMiddleware } from './helpers';


const debug = require('debug')('app:routes:sitebuilder');

const router = new Router({
  prefix: '/sitebuilder'
})
  .use(sitebuilderLocalsMiddleware());

router.get('main', '/', function*() {
  this.render('sitebuilder/main', Object.assign({}, this.jadeLocals, {
  }), true);
});

router.get('/content/:key', function*() {

  if (!this.sbMetainfo.hasOwnProperty(this.params.key)) {
    this.redirect(router.url('main'))
    return;
  }
  const data = this.sbMetainfo[this.params.key]
  const contentItems = yield Repo.readJSONData('liberty-laser-eye-0', this.params.key)
  this.render('sitebuilder/contentList', Object.assign({}, this.jadeLocals, {
    contentItems,
    metainfo: data.metainfo,
    contentKey: this.params.key,
    isContentOpen: true
  }), true);
});

router.get('/content/:key/:index', function*() {

  if (!this.sbMetainfo.hasOwnProperty(this.params.key)) {
    this.redirect(router.url('main'))
    return;
  }
  const data = this.sbMetainfo[this.params.key]
  const contentItems = yield Repo.readJSONData('liberty-laser-eye-0', this.params.key)
  this.render('sitebuilder/contentEditor', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(contentItems[this.params.index]),
    schema: JSON.stringify(data.metainfo.schema),
    isContentOpen: true
  }), true);
});

module.exports = router;
