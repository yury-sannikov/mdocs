import config from '../config'
import bluebird from 'bluebird'
import path from 'path'

const fs = bluebird.promisifyAll(require('fs'))

const METAINFO_FILE = 'metainfo.json'
const JSON_LOCATION = 'src/data/'

export function ensureWorkingDirectory() {
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
