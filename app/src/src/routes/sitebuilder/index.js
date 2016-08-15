
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
const MENU_JSON_KEY = 'menu'
const PRACTICE_KEY = 'practice'


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

router.get('menu', '/:sid/menu', function*() {
  const pagesFn = (pages) => pages.map((item) => ({
    name: item.title,
    id: `/${item.path}`
  }))
  let result = []
  for (let key in this.sbMetainfo) {
    if (key === 'plainHtml') {
      result.push({
        name: 'Pages',
        id: 'plainHtml',
        children: pagesFn(this.sbMetainfo[key])
      })
    } else {
      var item = this.sbMetainfo[key];
      var children = []
      if (item.indexPath.length > 0) {
        children.push({
          name: `(${item.metainfo.menuCaption.toLowerCase()} index)`,
          id: `/${item.indexPath}`
        })
      }
      item.permalinks.forEach((item) => {
        children.push({
          name: item, // Todo. read metainfo.titleRef from correspondent data/.json
          id: `/${item}`
        })
      })

      result.push({
        name: item.metainfo.menuCaption,
        id: item.indexPath,
        children: children
      })

    }
  }
  const menu = yield Repo.readJSONData(this.params.sid, MENU_JSON_KEY)
  const transformMenuItems = (mi) => ({
    name: mi.caption,
    id: mi.href,
    children: mi.content ? mi.content.map(transformMenuItems) : []
  })
  const menuTransformed = menu.map(transformMenuItems)
  const title = 'Menu Editor'
  this.render('sitebuilder/menuEditor', Object.assign({}, this.jadeLocals, {
    availableLinks: JSON.stringify(result),
    menu: JSON.stringify(menuTransformed),
    nav_title: title,
    nav_crumbs: [[title], ['Overview', router.url('main', {sid: this.params.sid})]]
  }), true);
});

router.post('/:sid/menu', function*() {
  yield Repo.writeJSONData(this.params.sid, MENU_JSON_KEY, JSON.parse(this.request.body.content))
  yield Repo.metainfo(this.currentUser.id, this.params.sid)
  this.flash = 'Menu has been updated'
  this.redirect(router.url('menu', {sid: this.params.sid}))
})

function getFroalaEditorOptions(sid) {
  return JSON.stringify({
    SITEBUILDER_PREIVEW_URL: config.SITEBUILDER_PREIVEW_URL,
    toolbarInline: false,
    iframe: true,
    fileUploadURL: `${config.SITEBUILDER_PREIVEW_URL}/assets`,
    fileUploadParams: {
      sid
    },
    imageManagerPageSize: 20,
    imageManagerScrollOffset: 10,
    imageManagerLoadURL: `${config.SITEBUILDER_PREIVEW_URL}/assets/imglist`,
    imageManagerLoadMethod: 'GET',
    imageManagerLoadParams: {
      sid
    },
    imageUploadURL: `${config.SITEBUILDER_PREIVEW_URL}/assets`,
    imageUploadParams: {sid, type: 'image'},
    imageUploadMethod: 'POST',
    imageMaxSize: 8 * 1024 * 1024,
    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'svg'],
    imageManagerDeleteURL: `${config.SITEBUILDER_PREIVEW_URL}/assets/_delete`,
    imageManagerDeleteMethod: 'POST',
    imageManagerDeleteParams: {
      sid
    }
  })
}
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

router.get('pagesList', '/:sid/pages', function*() {
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
    staticList: true,
    nav_title: 'Pages',
    nav_crumbs: [['Pages'], ['Overview', router.url('main', {sid: this.params.sid})]]
  }), true);

})

router.get('/:sid/pages/:index', function*() {
  const contentItems = this.sbMetainfo[STATIC_HTML_KEY]
  const fileName = contentItems[this.params.index].path
  const data = yield Repo.readHTMLData(this.params.sid, fileName)
  const permalink = `/${fileName}`
  const schema = {
    type: 'object',
    title: data.attributes.title,
    properties: {
      title: {
        title: 'Title',
        type: 'string'
      },
      htmlContent: {
        title: 'Page Content',
        input_height: '300px',
        type: 'string',
        format: 'html',
        options: {
          wysiwyg: true
        }
      }
    }
  }
  const page = {
    title: data.attributes.title,
    htmlContent: data.body
  }

  const froalaOptions = getFroalaEditorOptions(this.params.sid)

  this.render('sitebuilder/pageEditor', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(page),
    permalink,
    froalaOptions,
    schema: JSON.stringify(schema),
    isContentOpen: true,
    nav_title: data.attributes.title,
    nav_crumbs: [[data.attributes.title], ['Pages', router.url('pagesList', {sid: this.params.sid})], ['Overview', router.url('main', {sid: this.params.sid})]]

  }), true);
})

router.post('/:sid/pages/:index', function*() {
  const contentItems = this.sbMetainfo[STATIC_HTML_KEY]
  const fileName = contentItems[this.params.index].path

  yield Repo.writeHTMLData(this.params.sid, fileName, JSON.parse(this.request.body.content))
  yield Repo.metainfo(this.currentUser.id, this.params.sid)

  this.redirect(router.url('pagesList', {sid: this.params.sid}))
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
  yield Repo.metainfo(this.currentUser.id, this.params.sid)

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
  const froalaOptions = getFroalaEditorOptions(this.params.sid)
  this.render('sitebuilder/contentEditor', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(dataItem),
    froalaOptions,
    permalink,
    schema: JSON.stringify(data.metainfo.schema),
    isContentOpen: true,
    nav_title: title,
    nav_crumbs: [[title], [data.metainfo.menuCaption, router.url('contentList', {key:this.params.key, sid: this.params.sid})], ['Overview', router.url('main', {sid: this.params.sid})]]

  }), true);
});

router.get('practiceInfo','/:sid/practice', function*() {

    if (!this.sbMetainfo.hasOwnProperty(PRACTICE_KEY)) {
    this.redirect(router.url('main', {sid: this.params.sid}))
    return;
  }
  const data = this.sbMetainfo[PRACTICE_KEY]
  const dataItem = yield Repo.readJSONData(this.params.sid, PRACTICE_KEY)
  const dataTitle = data.metainfo.titleRef ? dataItem[data.metainfo.titleRef] : ''
  const { schema: { title =  dataTitle} = {} } = data.metainfo
  const permalink = null;
  const froalaOptions = getFroalaEditorOptions(this.params.sid)
  this.render('sitebuilder/contentEditor', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(dataItem),
    froalaOptions,
    permalink,
    schema: JSON.stringify(data.metainfo.schema || {}),
    isContentOpen: false,
    nav_title: title,
    nav_crumbs: [[title], ['Overview', router.url('main', {sid: this.params.sid})]]

  }), true);
})

router.post('/:sid/practice', function*() {
  yield Repo.writeJSONData(this.params.sid, PRACTICE_KEY, JSON.parse(this.request.body.content))
  yield Repo.metainfo(this.currentUser.id, this.params.sid)
  this.flash = 'Practice information has been updated'
  this.redirect(router.url('practiceInfo', {sid: this.params.sid}))
})


module.exports = router;
