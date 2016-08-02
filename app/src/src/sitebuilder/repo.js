import config from '../config'
import bluebird from 'bluebird'
import path from 'path'
import jwt from 'jsonwebtoken'

const mkdirp = bluebird.promisify(require('mkdirp'));
const debug = require('debug')('app:sitebuilder:repo');

const ENGINE_VERSION = '0.1'
//const SiteBuilderEngine = require('../../shared_modules/sb_engine_'+ENGINE_VERSION)

const fs = bluebird.promisifyAll(require('fs'))

const METAINFO_FILE = 'metainfo.json'
const JSON_LOCATION = 'src/data/'
const AUTH_VALID_FOR_MILLISECONDS = 1000 * 10; //1000 * 60 * 10
const MDOCS_ISSUER = 'mdocs'

export function* prepare(siteId) {
  const workDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId))
  const buildDir = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, siteId))
  yield mkdirp(buildDir)
  const options = {
    metainfo: 'metainfo',
    partials: 'partials',
    source: 'src',
    dataFolder: 'src/data',
    theme: 'cleanui'
  }
  // debug(`Prepare static site with workDir=${workDir}, buildDir=${buildDir}`)
  // let engine = new SiteBuilderEngine(workDir, buildDir, options)
  // engine = bluebird.promisifyAll(engine, {context: engine})
  // yield engine.prepareAsync()

}

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

  // check if this site id is valid
  const workDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, decoded.sub))

  try{
    yield fs.statAsync(workDir)
  }
  catch(e){
    debug(`Stat error: ${e}`)
    return {
      e: `Supplied site ID ${decoded.sub} is not accessible or invalid`
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
  const base = baseBuildPath(siteId)
  try {
    const content = yield fs.readFileAsync(path.join(base, METAINFO_FILE), 'utf8')
    return JSON.parse(content)
  } catch(e) {
    debug(`Unable to read metainfo.json. ${e}`)
    return {}
  }
}

export function* readJSONData(siteId, key) {
  const base = baseSrcPath(siteId)
  const content = yield fs.readFileAsync(path.join(base, JSON_LOCATION, key + '.json'), 'utf8')
  return JSON.parse(content)
}


function baseBuildPath(siteId) {
  return path.resolve(path.join(path.normalize(config.SITEBUILDER_BUILD_DIR), siteId));
}

function baseSrcPath(siteId) {
  return path.resolve(path.join(path.normalize(config.SITEBUILDER_SOURCE_DIR), siteId));
}
