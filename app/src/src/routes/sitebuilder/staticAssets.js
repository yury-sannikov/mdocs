'use strict';

const path = require('path');
const assert = require('assert');
const debug = require('debug')('app:sitebuilder:static-assets');
const send = require('koa-send');
const config = require('../../config');


module.exports = serve;


function serve(opts) {
  opts = Object.assign({},
  {
    prefix: '/sitebuilderpreview'
  }, opts)

  assert(opts.sessionKey, 'session key should be specified');
  if (opts.index !== false) opts.index = opts.index || 'index.html';

  return function *serve(next){

    if (this.method !== 'HEAD' && this.method !== 'GET') {
      yield* next
      return
    }

    // response is already handled
    if (this.body != null || this.status != 404) {
      return;
    }

    const siteId = this.session[opts.sessionKey]

    if (!siteId) {
      this.status = 401
      this.body = 'No Session'
      return
    }

    const assetsIndex = this.path.indexOf(opts.prefix)
    if (assetsIndex >= 0) {
      const urlPath = this.path.slice(assetsIndex + opts.prefix.length)

      const sendOpts = Object.assign({}, opts, {
        root: path.resolve(path.join(config.SITEBUILDER_BUILD_DIR, siteId))
      })

      debug(`Serving ${this.path} as ${urlPath} from root ${sendOpts.root}`)


      if (yield send(this, urlPath ? urlPath : '/', sendOpts)) return;
    }
    yield* next;
  };
}
