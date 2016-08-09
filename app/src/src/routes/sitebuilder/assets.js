import cors from 'koa-cors'
import Router from 'koa-router';
import config from '../../config';
import { Repo } from '../../sitebuilder';
// import { sitebuilderLocalsMiddleware } from './helpers';
// import _ from 'lodash';


const debug = require('debug')('app:routes:sitebuilder:preview:assets');

const router = new Router({
  prefix: '/assets'
})

router.use(cors({
    credentials: true,
    origin: config.SITEBUILDER_CORS_ORIGIN
  }))

router.use(function*(next) {
  if (!this.session.sbSession) {
    this.body = 'no session'
    return
  }
  return yield* next
})

router.options('/',  function*() {} )
router.options('/*',  function*() {} )

router.get('/imglist', function*() {
  const { uid, siteId } = this.session.sbSession
  const urlPrefix = config.SITEBUILDER_PREIVEW_URL
  this.body = (yield Repo.listImages(uid, siteId)).map((f) => { return {url: `${urlPrefix}/${f.url}`} })
})

router.post('/', function*() {
  const { sid, type = '' } = this.request.body.fields
  const { file } = this.request.body.files
  const { uid, siteId } = this.session.sbSession

  if (sid !== this.session.sbSession.siteId) {
    this.throw('Wrong session id')
  }
  const assetUrl = yield Repo.uploadFile(uid, siteId, file.path, file.name, type)
  this.status = 201
  this.body = { link: `${config.SITEBUILDER_PREIVEW_URL}/${assetUrl}` }
});

router.delete('/*', function*() {
  const { uid, siteId } = this.session.sbSession
  this.body = yield Repo.deleteAsset(uid, siteId, this.request.url)
})
module.exports = router;
