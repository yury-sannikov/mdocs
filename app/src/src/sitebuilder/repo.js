import config from '../config'
import bluebird from 'bluebird'
import path from 'path'
import jwt from 'jsonwebtoken'
const debug = require('debug')('app:sitebuilder:repo');



const fs = bluebird.promisifyAll(require('fs'))

const METAINFO_FILE = 'metainfo.json'
const JSON_LOCATION = 'src/data/'
const AUTH_VALID_FOR_MILLISECONDS = 1000 * 60 * 10
const MDOCS_ISSUER = 'mdocs'

export function* authenticate(token) {
  let decoded
  try {
    decoded = jwt.verify(token, config.SITEBUILDER_JWT_SECRET, {
      ignoreExpiration: false,
      issuer: MDOCS_ISSUER
    })
  }
  catch(e) {
    debug(`Error while decoding token ${e.message}`)
    return {
      e: e.message
    }
  }
  debug(`Perfom auth with token ${JSON.stringify(decoded)}`)

  return {
    e: 0,
    subject: decoded.sub,
    expAt: (new Date()).getTime() + AUTH_VALID_FOR_MILLISECONDS
  }
}

export function* readMetainfo(siteId) {
  const base = basePath(siteId)
  const content = yield fs.readFileAsync(path.join(base, METAINFO_FILE), 'utf8')
  return JSON.parse(content)
}

export function* readJSONData(siteId, key) {
  const base = basePath(siteId)
  const content = yield fs.readFileAsync(path.join(base, JSON_LOCATION, key + '.json'), 'utf8')
  return JSON.parse(content)
}


function basePath(siteId) {
  return path.join(path.normalize(config.SITEBUILDER_DIR), siteId);
}
