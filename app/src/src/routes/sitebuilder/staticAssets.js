'use strict';

const path = require('path');
const assert = require('assert');
const debug = require('debug')('koa-static');
const send = require('koa-send');
const config = require('../../config');


module.exports = serve;


function serve(opts) {
  opts = Object.assign({},
  {
    prefix: '/assets'
  }, opts)

  assert(opts.sessionKey, 'session key should be specified');

  return function *serve(next){

    if (this.method !== 'HEAD' && this.method !== 'GET') {
      yield* next
      return
    }
    const siteId = this.session[opts.sessionKey]

    if (!siteId) {
      this.status = 401
      this.body = 'No Session'
      return
    }

    const assetsIndex = this.path.indexOf(opts.prefix)
    if (assetsIndex >= 0) {
      const urlPath = this.path.slice(assetsIndex)

      const sendOpts = Object.assign({}, opts, {
        root: path.resolve(path.join(config.SITEBUILDER_DIR, siteId))
      })

      if (yield send(this, urlPath, sendOpts)) return;
    }
    yield* next;
  };
}
