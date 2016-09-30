import _ from 'lodash'
import { readMetainfo } from '../../sitebuilder/repo'
import config from '../../config'
import querystring from 'querystring'
import url from 'url'
import jwt from 'jsonwebtoken'
const debug = require('debug')('app:routes:sitebuilder:helper');


const SITEBUILDER_AUTH_FLAG_COOKIE_NAME = 'hassbauth'
const SITEBUILDER_AUTH_PATH = '/auth'
const SHORT_JWT_EXPIRATION_SEC = 5
const JWT_ISSUER = 'mdocs'
const SB_ISSUER = 'sitebuilder'
const STATIC_HTML_KEY = 'plainHtml'

export function sitebuilderLocalsMiddleware() {
  return function *(next) {
    const sbMetainfo = yield readMetainfo(this.currentUser.id, this.params.sid)
    this.sbMetainfo = sbMetainfo

    const contentMenuItems = Object.keys(sbMetainfo)
      .map((key) => {
        return {
          key,
          metainfo: sbMetainfo[key].metainfo
        }
      })
      .filter((item) => !_.isEmpty(item.metainfo)
        || item.key === STATIC_HTML_KEY)

    this.jadeLocals = Object.assign({}, this.jadeLocals, {
      contentMenuItems,
      siteId: this.params.sid
    });

    yield* next;
  }
}
export function sitebuilderSafeModeOnException() {
  return function *(next) {
    try {
      return yield* next;
    } catch(e) {
      debug(`signout due sitebuilder exception ${e}`)
      this.cookies.set(SITEBUILDER_AUTH_FLAG_COOKIE_NAME)
      delete this.session.sbSiteId
      // TODO: Revert some changes in a repo
      throw e
    }
  }
}

export function sitebuilderPreivewAuthenticated() {
  return function *(next) {
    if (this.cookies.get(SITEBUILDER_AUTH_FLAG_COOKIE_NAME)) {
      if (this.session.sbSiteId === this.params.sid) {
        return yield* next;
      }
      debug(`Reset sitebuilder cookie due to site id change from ${this.session.sbSiteId} to ${this.params.sid}`)
    }

    delete this.session.sbSiteId
    this.cookies.set(SITEBUILDER_AUTH_FLAG_COOKIE_NAME)

    if (this.query.sbauthacktoken) {
      debug(`Authenticate with acknowledge token`)
      //Check token
      const token = this.query.sbauthacktoken
      let decoded
      try {
        decoded = jwt.verify(token, config.SITEBUILDER_JWT_SECRET, {
          ignoreExpiration: false,
          issuer: SB_ISSUER
        })
      }
      catch(e) {
        debug(`Unable to verify JWT from sitebuilder: ${e.message}`)
        decoded = { e : e.message }
      }

      if (!decoded || decoded.e) {
        this.body = 'Sitebuilder auth failed: ' + decoded.e
        return;
      }
      const cookieExpires = new Date(decoded.expAt)
      debug(`Authenticated by Sitebuilder with token ${JSON.stringify(decoded)}. Cookie expires at ${cookieExpires.toString()}`)

      // Set cookies
      this.cookies.set(SITEBUILDER_AUTH_FLAG_COOKIE_NAME, decoded, {
        expires: cookieExpires,
        secure: this.request.secure,
        httpOnly: true,
        signed: true,
        overwrite: true
      })

      // Set authenticated site identifier
      this.session.sbSiteId = decoded.subject

      let parsedUrl = url.parse(this.request.href, true)
      parsedUrl.search = undefined
      delete parsedUrl.query.sbauthacktoken
      debug(url.format(parsedUrl))
      this.redirect(url.format(parsedUrl))
      return
    }

    debug(`Perform authentication with sitebuilder`)

    const { id: userId = '0|0'} = this.currentUser

    const token = jwt.sign({
        uid: userId.split('|')[1]
      }, config.SITEBUILDER_JWT_SECRET, {
      expiresIn: SHORT_JWT_EXPIRATION_SEC,
      issuer: JWT_ISSUER,
      subject: this.params.sid
    })
    const redirect = querystring.stringify({
      r:this.request.href
    });
    this.redirect(`${config.SITEBUILDER_PREIVEW_URL}${SITEBUILDER_AUTH_PATH}/${token}?${redirect}`)
  }
}
