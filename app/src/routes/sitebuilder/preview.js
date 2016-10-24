
import Router from 'koa-router';
import { Repo } from '../../sitebuilder';
import url from 'url'
import jwt from 'jsonwebtoken'
import config from '../../config'


const debug = require('debug')('app:routes:sitebuilder:preview');
const JWT_ISSUER = 'sitebuilder'
const SHORT_JWT_EXPIRATION_SEC = 25
const PREVIEW_ROUTE_PATH = config.DEV_MODE ? null : '/sitebuilderpreview'
const DEPLOY_SLUG = '/__deploy'
const PREDEPLOY_POSTFIX = '-predeploy'
const router = new Router({
  prefix: PREVIEW_ROUTE_PATH
})
router.use(require('./assets').routes())

router.get('/__generate', function*() {
  if (!this.session.sbSession) {
    this.body = 'no session'
    return
  }
  const { uid, siteId } = this.session.sbSession
  const predeploy = parseInt(this.query.d) === 1
  this.session.sbSession.buildPostfix = predeploy ? PREDEPLOY_POSTFIX : ''
  if (predeploy) {
    const deployOptions = {
      deployUrl: `${config.SITEBUILDER_PREIVEW_URL}${DEPLOY_SLUG}`
    }
    yield Repo.predeploy(uid, siteId,
      !!parseInt(this.query.f), deployOptions)
  } else {
    yield Repo.generate(uid, siteId, !!parseInt(this.query.f))
  }
  this.redirect(this.query.r)
})

router.post('authPost','/auth', function*() {
  const parsedUrl = url.parse(this.request.body.redirect, true)
  parsedUrl.search = undefined

  const result = yield Repo.authenticate(this.request.body.token);

  if (!result.e) {
    this.session.sbSession = {
      uid: result.uid,
      siteId: result.subject,
      buildPrefix: `${result.uid}/${result.subject}`,
      buildPostfix: ''
    }

    yield Repo.prepare(result.uid, result.subject)
  }


  const token = jwt.sign(result, config.SITEBUILDER_JWT_SECRET, {
    expiresIn: SHORT_JWT_EXPIRATION_SEC,
    issuer: JWT_ISSUER
  })

  parsedUrl.query.sbauthacktoken = token;
  this.redirect(url.format(parsedUrl))
})

router.get('/auth/:token', function*() {
  delete this.session.sbSession
  const authPostUrl = router.url('authPost')
  const developerRun = !!config.SITEBUILDER_DEV_PORT
  this.render('sitebuilder/sbauth', Object.assign({}, this.jadeLocals, {
    token: this.params.token,
    redirectTo: this.query.r,
    formAction: developerRun ? authPostUrl : authPostUrl.replace(PREVIEW_ROUTE_PATH, '')
  }), true);
})

const staticAssetsMiddleware = require('./staticAssets')({
  maxage: 1000 * 20,
  gzip: true,
  sessionKey: 'sbSession.buildPrefix',
  postfixKey: 'sbSession.buildPostfix'
});

router.get('*', staticAssetsMiddleware);


module.exports = router;
