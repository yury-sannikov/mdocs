
import Router from 'koa-router';
import _ from 'lodash';
import { Repo } from '../../sitebuilder';
import { sitebuilderLocalsMiddleware, sitebuilderPreivewAuthenticated } from './helpers';
import config from '../../config';
import url from 'url'
import { checkAuthenticated } from '../../belt';


const debug = require('debug')('app:routes:sitebuilder');
const GENERATE_SLUG =  '/__generate'
const STATIC_HTML_KEY = 'plainHtml'

const router = new Router({
  prefix: '/sitebuilder'
})
  .use(checkAuthenticated)
  .use(sitebuilderLocalsMiddleware())
  .use(sitebuilderPreivewAuthenticated())


router.get('main', '/:sid', function*() {
  this.render('sitebuilder/main', Object.assign({}, this.jadeLocals, {
  }), true);
});

function getPreviewURLs(data, count, force = true) {
  const generateUrl = url.parse(`${config.SITEBUILDER_PREIVEW_URL}${GENERATE_SLUG}`)
  generateUrl.query = {f: force ? 1 : 0}

  const previewUrls = data.permalinks.map((p) => {
    generateUrl.query.r = `/${p}`
    return url.format(generateUrl)
  })

  if (previewUrls.length > 0) {
    return previewUrls
  }

  generateUrl.query.r = `/${data.indexPath}`
  return Array(count).fill(url.format(generateUrl))
}

router.get('contentList', '/:sid/pages', function*() {
  const contentItems = this.sbMetainfo[STATIC_HTML_KEY]
  const contentHeaders = [
    {
      "title": "Title",
      "ref": "title",
      "css": ""
    }
  ]
  const permalinks = contentItems.map((i) => i.path || '')
  const previewUrls = getPreviewURLs({ permalinks }, contentItems.length, false)
  this.render('sitebuilder/contentList', Object.assign({}, this.jadeLocals, {
    contentItems,
    contentHeaders,
    previewUrls,
    permalinks,
    contentKey: 'pages',
    isContentOpen: true,
    nav_title: 'Pages',
    nav_crumbs: [['Pages'], ['Overview', router.url('main', {sid: this.params.sid})]]
  }), true);

})

router.get('contentList', '/:sid/content/:key', function*() {

  if (!this.sbMetainfo.hasOwnProperty(this.params.key)) {
    this.redirect(router.url('main', {sid: this.params.sid}))
    return;
  }

  const data = this.sbMetainfo[this.params.key]
  const contentHeaders = data.metainfo.listProps
  const contentItems = yield Repo.readJSONData(this.params.sid, this.params.key)
  let previewUrls = getPreviewURLs(data, contentItems.length)
  this.render('sitebuilder/contentList', Object.assign({}, this.jadeLocals, {
    contentItems,
    contentHeaders,
    metainfo: data.metainfo,
    previewUrls,
    permalinks: data.permalinks,
    contentKey: this.params.key,
    isContentOpen: true,
    nav_title: data.metainfo.menuCaption,
    nav_crumbs: [[data.metainfo.menuCaption], ['Overview', router.url('main', {sid: this.params.sid})]]
  }), true);
});

router.post('/:sid/content/:key/:index', function*() {
  yield Repo.writeJSONDataItem(this.params.sid, this.params.key, this.params.index, JSON.parse(this.request.body.content))
  this.redirect(router.url('contentList', {key:this.params.key, sid: this.params.sid}))
})

router.get('/:sid/content/:key/:index', function*() {

  if (!this.sbMetainfo.hasOwnProperty(this.params.key)) {
    this.redirect(router.url('main', {sid: this.params.sid}))
    return;
  }
  const data = this.sbMetainfo[this.params.key]
  const contentItems = yield Repo.readJSONData(this.params.sid, this.params.key)
  const dataItem = Object.assign({}, contentItems[this.params.index]);
  const dataTitle = data.metainfo.titleRef ? dataItem[data.metainfo.titleRef] : ''
  const title = data.metainfo.schema.title || dataTitle
  const permalink = data.permalinks.length > 0 ? '/' + data.permalinks[this.params.index] : null
  this.render('sitebuilder/contentEditor', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(dataItem),
    permalink,
    schema: JSON.stringify(data.metainfo.schema),
    isContentOpen: true,
    nav_title: title,
    nav_crumbs: [[title], [data.metainfo.menuCaption, router.url('contentList', {key:this.params.key, sid: this.params.sid})], ['Overview', router.url('main', {sid: this.params.sid})]]

  }), true);
});

module.exports = router;
