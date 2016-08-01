
import Router from 'koa-router';
import { Repo } from '../../sitebuilder';
import url from 'url'
import jwt from 'jsonwebtoken'
import config from '../../config'


const debug = require('debug')('app:routes:sitebuilder:preview');
const JWT_ISSUER = 'sitebuilder'
const SHORT_JWT_EXPIRATION_MS = 5000

const router = new Router({
  prefix: '/sitebuilderpreview'
})


router.use(require('./assets').routes())

router.get('main', '/', function*() {
  this.body = {text: 'preview'}
});

router.post('authPost','/auth', function*() {
  const parsedUrl = url.parse(this.request.body.redirect, true)
  parsedUrl.search = undefined

  const result = yield Repo.authenticate(this.request.body.token);

  if (!result.e) {
    this.session.sbSiteId = result.subject
  }

  const token = jwt.sign(result, config.SITEBUILDER_JWT_SECRET, {
    expiresIn: SHORT_JWT_EXPIRATION_MS,
    issuer: JWT_ISSUER
  })

  parsedUrl.query.sbauthacktoken = token;
  this.redirect(url.format(parsedUrl))
})

router.get('/auth/:token', function*() {
  delete this.session.sbSiteId
  this.render('sitebuilder/sbauth', Object.assign({}, this.jadeLocals, {
    token: this.params.token,
    redirectTo: this.query.r,
    formAction: router.url('authPost')
  }), true);
})

const staticAssetsMiddleware = require('./staticAssets')({
  maxage: 1000 * 20,
  gzip: true,
  sessionKey: 'sbSiteId',
  postfix: '-build'
});

router.get('/*', staticAssetsMiddleware);


module.exports = router;
