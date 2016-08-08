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

router.post('/', function*() {
  const { sid } = this.request.body.fields
  const { file } = this.request.body.files
  const { uid, siteId } = this.session.sbSession

  if (sid !== this.session.sbSession.siteId) {
    this.throw('Wrong session id')
  }
  const assetUrl = yield Repo.uploadFile(uid, siteId, file.path, file.name)
  this.status = 201
  this.body = { link: '/' + assetUrl}
});

module.exports = router;
