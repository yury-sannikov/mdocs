
import Router from 'koa-router';
import _ from 'lodash';
import { Repo } from '../../sitebuilder';
import { sitebuilderLocalsMiddleware, sitebuilderPreivewAuthenticated } from './helpers';


const debug = require('debug')('app:routes:sitebuilder');

const router = new Router({
  prefix: '/sitebuilder'
})
  .use(sitebuilderLocalsMiddleware())
  .use(sitebuilderPreivewAuthenticated())


router.get('main', '/:sid', function*() {
  this.render('sitebuilder/main', Object.assign({}, this.jadeLocals, {
  }), true);
});

router.get('contentList', '/:sid/content/:key', function*() {

  if (!this.sbMetainfo.hasOwnProperty(this.params.key)) {
    this.redirect(router.url('main', {sid: this.params.sid}))
    return;
  }
  const data = this.sbMetainfo[this.params.key]
  const contentHeaders = data.metainfo.listProps
  const contentItems = yield Repo.readJSONData(this.params.sid, this.params.key)
  this.render('sitebuilder/contentList', Object.assign({}, this.jadeLocals, {
    contentItems,
    contentHeaders,
    metainfo: data.metainfo,
    permalinks: data.permalinks,
    contentKey: this.params.key,
    isContentOpen: true,
    nav_title: data.metainfo.menuCaption,
    nav_crumbs: [[data.metainfo.menuCaption], ['Overview', router.url('main', {sid: this.params.sid})]]
  }), true);
});

router.get('/:sid/content/:key/:index', function*() {

  if (!this.sbMetainfo.hasOwnProperty(this.params.key)) {
    this.redirect(router.url('main', {sid: this.params.sid}))
    return;
  }
  const data = this.sbMetainfo[this.params.key]
  const contentItems = yield Repo.readJSONData(this.params.sid, this.params.key)
  const dataItem = Object.assign({}, contentItems[this.params.index], {permalink: '/' + data.permalinks[this.params.index]});
  const dataTitle = data.metainfo.titleRef ? dataItem[data.metainfo.titleRef] : ''
  const title = data.metainfo.schema.title || dataTitle
  this.render('sitebuilder/contentEditor', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(dataItem),
    schema: JSON.stringify(data.metainfo.schema),
    isContentOpen: true,
    nav_title: title,
    nav_crumbs: [[title], [data.metainfo.menuCaption, router.url('contentList', {key:this.params.key, sid: this.params.sid})], ['Overview', router.url('main', {sid: this.params.sid})]]

  }), true);
});

module.exports = router;
