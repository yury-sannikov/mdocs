import config from '../config'
import bluebird from 'bluebird'
import path from 'path'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import frontMatter from 'front-matter'
import jsYaml from 'js-yaml'

const mkdirp = bluebird.promisify(require('mkdirp'));
const rimraf = bluebird.promisify(require('rimraf'));

const debug = require('debug')('app:sitebuilder:repo');

const ENGINE_VERSION = '0.2'
const SiteBuilderEngine = require('../../shared_modules/sb_engine_' + ENGINE_VERSION)

const fs = bluebird.promisifyAll(require('fs'))

const METAINFO_FILE = 'metainfo.json'
const JSON_LOCATION = 'src/data/'
const HTML_LOCATION = 'src/'
const AUTH_VALID_FOR_MILLISECONDS = 1000 * 60 * 10
const MDOCS_ISSUER = 'mdocs'
const PREDEPLOY_POSTFIX = '-predeploy'
const THEMES_DIR = 'sitebuilder-themes'
const DEFAULT_THEME = 'cleanui'
const PRACTICE_JSON_KEY = 'practice'

const METALSMITH_OPTIONS_STATIC = {
  metainfo: 'metainfo',
  source: 'src',
  dataFolder: 'src/data'
}

const metalsmithOptionsForTheme = (theme) => {
  const themeDir = path.join(config.SITEBUILDER_SOURCE_DIR, THEMES_DIR, theme)
  return Object.assign({}, METALSMITH_OPTIONS_STATIC, {
    theme: theme,
    themeDir: themeDir,
    partialsPath: themeDir
  });
}

const ASSETS_UPLOADS = 'assets/uploads'
const ASSETS_IMAGES = `${ASSETS_UPLOADS}/images`

function massageUserId(userId) {
  if (userId.indexOf('|') !== -1) {
    userId = userId.split('|')[1]
  }
  return userId
}

export function* listImages(userId, siteId) {
  const buildImgs = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, siteId, ASSETS_IMAGES))
  const dir = yield fs.readdirAsync(buildImgs)
  return dir.map((f) => {
    return {
      url: `${ASSETS_IMAGES}/${f}`
    }
  })
}

export function* deleteAsset(userId, siteId, rawurl) {
  const url = decodeURIComponent(rawurl)
  const idx = url.indexOf(ASSETS_UPLOADS)
  if (idx === -1) {
    throw new Error('Wrong URL')
  }
  const pathPart = url.slice(idx - 1)
  const sourceDirDest = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId, pathPart))
  const buildDirDest = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, siteId, pathPart))
  debug(`Deleting asset ${pathPart} from ${sourceDirDest} and ${buildDirDest}`)
  return yield* [
    fs.unlinkAsync(sourceDirDest),
    fs.unlinkAsync(buildDirDest)
  ]
}

export function* uploadFile(userId, siteId, sourceTmpPath, rawfilename, type) {
  const filename = decodeURIComponent(rawfilename)
  const uploadSlug = type === 'image' ? ASSETS_IMAGES : ASSETS_UPLOADS
  const buildDir = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, siteId, uploadSlug))
  const sourceDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId, uploadSlug))
  const buildDirDest = path.join(buildDir, filename)
  const sourceDirDest = path.join(sourceDir, filename)
  yield mkdirp(buildDir)
  yield mkdirp(sourceDir)
  debug(`Upload file ${filename} to ${buildDirDest} and ${sourceDirDest}`)
  const assetUrl = `${uploadSlug}/${filename}`

  return new Promise(function(resolve, reject) {
    let counter = 0
    function wfinish() {
      counter = counter + 1
      if (counter === 2) { 
        resolve(assetUrl) 
      } 
    }
    const rs = fs.createReadStream(sourceTmpPath)
    const ws1 = fs.createWriteStream(buildDirDest)
    const ws2 = fs.createWriteStream(sourceDirDest)
    rs.on('error', reject)
    ws1.on('error', reject)
    ws2.on('error', reject)
    ws1.on('finish', wfinish)
    ws2.on('finish', wfinish)
    rs.pipe(ws1)
    rs.pipe(ws2)
  })
}

export function* prepare(userId, siteId) {
  userId = massageUserId(userId)
  const workDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId))
  const buildDir = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, siteId))
  yield rimraf(buildDir)
  yield mkdirp(buildDir)

  const themeId = yield getThemeIdentifier(siteId)
  debug(`Prepare static site with workDir=${workDir}, buildDir=${buildDir}, themeId=${themeId}`)
  let engine = new SiteBuilderEngine(workDir, buildDir, metalsmithOptionsForTheme(themeId))
  engine = bluebird.promisifyAll(engine, {context: engine})
  yield engine.prepareAsync()
}

export function* metainfo(userId, siteId) {
  userId = massageUserId(userId)
  const workDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId))
  const buildDir = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, siteId))
  yield mkdirp(buildDir)

  const themeId = yield getThemeIdentifier(siteId)
  debug(`Generate metainfo. workDir=${workDir}, buildDir=${buildDir}, themeId=${themeId}`)
  let engine = new SiteBuilderEngine(workDir, buildDir, metalsmithOptionsForTheme(themeId))
  engine = bluebird.promisifyAll(engine, {context: engine})
  yield engine.metainfoAsync()

}

export function* generate(userId, siteId, force, predeploy) {
  userId = massageUserId(userId)
  const workDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId))
  const buildDir = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, siteId))
  if (predeploy) {
    debug(`rm -rf ${buildDir}`)
    yield rimraf(buildDir)
  }
  yield mkdirp(buildDir)
  const themeId = yield getThemeIdentifier(siteId)
  debug(`Generate static site with workDir=${workDir}, buildDir=${buildDir}, themeId=${themeId}`)

  let engine = new SiteBuilderEngine(workDir, buildDir, metalsmithOptionsForTheme(themeId))
  engine = bluebird.promisifyAll(engine, {context: engine})
  if (predeploy) {
    const deployOptions = {
      banner: true,
      deployUrl: predeploy.deployUrl
    }
    yield engine.publishAsync(deployOptions)
  }
  else {
    yield engine.generateAsync(force)
  }
}

export function* predeploy(userId, siteId, predeploy) {
  userId = massageUserId(userId)
  const workDir = path.resolve(path.join(config.SITEBUILDER_SOURCE_DIR, siteId))
  const buildDir = path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, userId, `${siteId}${PREDEPLOY_POSTFIX}`))
  debug(`rm -rf ${buildDir}`)
  yield rimraf(buildDir)
  yield mkdirp(buildDir)
  const themeId = yield getThemeIdentifier(siteId)
  debug(`Predeploy static site with workDir=${workDir}, buildDir=${buildDir}, themeId=${themeId}`)
  let engine = new SiteBuilderEngine(workDir, buildDir, metalsmithOptionsForTheme(themeId))
  engine = bluebird.promisifyAll(engine, {context: engine})
  const deployOptions = {
    banner: true,
    deployUrl: predeploy.deployUrl
  }
  yield engine.publishAsync(deployOptions)
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
    uid: decoded.uid,
    expAt: (new Date()).getTime() + AUTH_VALID_FOR_MILLISECONDS
  }
}

export function* readMetainfo(userId, siteId) {
  const base = baseBuildPath(userId, siteId)
  try {
    const content = yield fs.readFileAsync(path.join(base, METAINFO_FILE), 'utf8')
    return JSON.parse(content)
  } catch(e) {
    debug(`Unable to read metainfo.json. ${e}`)
    return {}
  }
}

export function* getThemeIdentifier(siteId) {
  const practiceData = yield readJSONData(siteId, PRACTICE_JSON_KEY)
  return practiceData.themeId || DEFAULT_THEME
}

export function* readJSONData(siteId, key) {
  const base = baseSrcPath(siteId)
  const content = yield fs.readFileAsync(path.join(base, JSON_LOCATION, key + '.json'), 'utf8')
  return JSON.parse(content)
}

export function* writeJSONDataItem(siteId, key, arrayIndex, obj) {
  let data = yield readJSONData(siteId, key)
  arrayIndex = parseInt(arrayIndex)
  if (_.isArray(data)) {
    data = [...data.slice(0, arrayIndex), obj, ...data.slice(arrayIndex + 1)]
  } else {
    data = Object.assign({}, data, obj)
  }
  const base = baseSrcPath(siteId)
  yield fs.writeFileAsync(path.join(base, JSON_LOCATION, key + '.json'), JSON.stringify(data, null, 2))
}

export function* writeNewJSONDataItem(siteId, key, obj) {
  let data = yield readJSONData(siteId, key)
  if (_.isArray(data)) {
    data = [...data, obj]
  } else {
    data = Object.assign({}, data, obj)
  }
  const base = baseSrcPath(siteId)
  yield fs.writeFileAsync(path.join(base, JSON_LOCATION, key + '.json'), JSON.stringify(data, null, 2))
}

export function* deleteJSONDataItem(siteId, key, arrayIndex) {
  let data = yield readJSONData(siteId, key)
  if (_.isArray(data)) {
    arrayIndex = parseInt(arrayIndex)
    data.splice(arrayIndex, 1)
  } else {
    delete data[arrayIndex]
  }
  const base = baseSrcPath(siteId)
  yield fs.writeFileAsync(path.join(base, JSON_LOCATION, key + '.json'), JSON.stringify(data, null, 2))

}


export function* writeJSONData(siteId, key, data) {
  const base = baseSrcPath(siteId)
  yield fs.writeFileAsync(path.join(base, JSON_LOCATION, key + '.json'), JSON.stringify(data, null, 2))
}

export function* readHTMLData(siteId, fileName) {
  const base = baseSrcPath(siteId)
  const content = yield fs.readFileAsync(path.join(base, HTML_LOCATION, (fileName || 'index') + '.html'), 'utf8')
  return frontMatter(content)
}
export function* writeHTMLData(siteId, fileName, newContent) {
  const content = yield readHTMLData(siteId, fileName)
  const attr = Object.assign({}, content.attributes, {title: newContent.title})
  const fm = jsYaml.safeDump(attr, {skipInvalid : true})
  const fileContent = `---\n${fm}---\n${newContent.htmlContent}`.replace(/{{&gt;/g,'{{>')
  const base = baseSrcPath(siteId)
  const fullFileName= path.join(base, HTML_LOCATION, (fileName || 'index') + '.html')
  yield fs.writeFileAsync(fullFileName, fileContent)
}


function baseBuildPath(userId, siteId) {
  userId = massageUserId(userId)
  return path.resolve(path.join(path.normalize(config.SITEBUILDER_BUILD_DIR), userId, siteId));
}

function baseSrcPath(siteId) {
  return path.resolve(path.join(path.normalize(config.SITEBUILDER_SOURCE_DIR), siteId));
}
