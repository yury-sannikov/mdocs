'use strict';
/**
 * Module Dependencies.
 */

var path  = require('path');
var fsextra    = require('fs-extra');
var copydir = require('copy-dir');


/**
 * Module Exports
 */

module.exports = function(assets) {
  assets = assets || [{}];
  assets = !Array.isArray(assets) ? [ assets ] : assets;

  return function(files, metalsmith, done) {
    assets.forEach(function(opts) {
      var src = opts.src;
      var relDest = opts.dest || 'public';
      var createDest = opts.createDest || true;

      var dst = path.join(metalsmith.destination(), relDest);

      if (createDest) {
        var dir = path.dirname(dst);

        fsextra.mkdirpSync(dir);
      }
      console.log(`copydir from ${src} to ${dst}`);
      copydir(src, dst, function(err) {
        if (err) return done(err);
        console.log(`copydir done.`);
        done();
      });
    });
  };
};
