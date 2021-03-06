'use strict';
const fs = require('fs');
const path = require('path');

module.exports = plugin;

function plugin(opts){
  opts = opts || {
    metainfoPath: './metainfo',
    includeForMetaOnly: [],
    outputFile: './metainfo.json'
  };
  return function(files, metalsmith, done) {
    const fileNames = Object.keys(files);

    let result = {}
    /*
      "contents" : {
        "indexPath": "/content",
        "metainfo": {
          "schema": ...,
          "defaults": ...
        },
        "permalinks": ['l1','l2', 'l3']
      }
    */
    opts.includeForMetaOnly.forEach((name) => {
      result[name] = {
        indexPath: '',
        permalinks: [],
        metainfo: readMetainfo(name, opts)
      };
    })

    for (let file of fileNames) {
      const fileObj = files[file];

      const sbMetainfo = fileObj.sb_metainfo

      if (sbMetainfo) {
        result[sbMetainfo] = {
          indexPath: fileObj.path,
          permalinks: [],
          metainfo: readMetainfo(sbMetainfo, opts)
        };
      }

      if (fileObj.collection) {
        fileObj.collection.forEach((col)=> {
          if (result[col]) {
            result[col].permalinks = [...result[col].permalinks, fileObj.path]
          }
        })
      }
    }

    fs.writeFile(path.normalize(opts.outputFile), JSON.stringify(result, null, 2), done);
  }
}

function readMetainfo(metainfoName, opts) {
  const fn = path.join(path.normalize(opts.metainfoPath), metainfoName + '.json');
  let content;
  try {
    content = fs.readFileSync(fn, 'utf8')
  }
  catch(e) {
    console.warn(`Warn: Unable to read file ${fn}. Error: ${e}`)
    return {};
  }
  return JSON.parse(content);
}
