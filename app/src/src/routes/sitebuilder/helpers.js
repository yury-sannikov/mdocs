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

export function sitebuilderLocalsMiddleware() {
  return function *(next) {
    const sbMetainfo = yield readMetainfo('liberty-laser-eye-0-build')
    this.sbMetainfo = sbMetainfo

    const contentMenuItems = Object.keys(sbMetainfo)
      .map((key) => {
        return {
          key,
          metainfo: sbMetainfo[key].metainfo
        }
      })
      .filter((item) => !_.isEmpty(item.metainfo))

    this.jadeLocals = Object.assign({}, this.jadeLocals, {
      contentMenuItems,
      siteId: this.params.sid
    });

    yield* next;
  }
}

export function sitebuilderPreivewAuthenticated() {
  return function *(next) {
    if (this.cookies.get(SITEBUILDER_AUTH_FLAG_COOKIE_NAME)) {
      return yield* next;
    }

    delete this.session.sbSiteId

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


    const token = jwt.sign({}, config.SITEBUILDER_JWT_SECRET, {
      expiresIn: SHORT_JWT_EXPIRATION_SEC,
      issuer: JWT_ISSUER,
      subject: 'liberty-laser-eye-0' //TODO:
    })
    const redirect = querystring.stringify({
      r:this.request.href
    });
    this.redirect(`${config.SITEBUILDER_PREIVEW_URL}${SITEBUILDER_AUTH_PATH}/${token}?${redirect}`)
  }
}
