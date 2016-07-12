import _ from 'lodash';
import JSONStream from 'JSONStream';
import cs from 'co-stream';
import pug from 'pug';
import fs from 'fs';
import ncp from 'ncp';
import moment from 'moment';

ncp.limit = 16;
const Promise = require('bluebird');
const Ncp = Promise.promisifyAll(ncp);
const Fs = Promise.promisifyAll(fs);

export function help() {
  return {
    name: 'generate',
    description: 'Generate marketing web sites using JSON as a source',
    options: [
      {
        key: '--selector',
        required: false,
        short: 'sel',
        description: 'JSON selector, for instance providers.* process each element in providers array'
      },
      {
        key: '--resource',
        required: true,
        short: 'resName',
        description: 'Resource name to generate WEB site'
      },
      {
        key: '--output-path',
        required: true,
        short: 'path',
        description: 'Output path to generate files'
      }
    ]
  };
}


export function* execute(inputStream, params) {
  const resourceName = params['resource'];
  if (_.isEmpty(resourceName)) {
    throw TypeError('You have to specify resource parameter');
  }
  const outputPath = params['output-path'];
  if (_.isEmpty(resourceName)) {
    throw TypeError('You have to specify output-path parameter');
  }
  const { selector } = params;

  const basePath =`${__dirname}/resources/${resourceName}`;

  // Copy resource folder to output except pug and paritals
  yield Ncp.ncpAsync(basePath, outputPath, {
    filter: (f) => (f.indexOf('.pug') === -1) && (f.indexOf('partials') === -1)
  });

  // Compile index.pug with partials
  const indexPug =`${basePath}/index.pug`;
  const rawPug = yield Fs.readFileAsync(indexPug)
  const pugify = pug.compile(rawPug, {
    filename: indexPug,
    compileDebug: true,
    pretty: true
  });

  // Process JSON data
  return inputStream
    .pipe(JSONStream.parse(selector || '*'))
    .pipe(cs.map(function* (data) {
      return yield process(data, resourceName, outputPath, pugify);
    },{ objectMode: true, parallel: 1 }));
}

const NONEXISTENT_DATA = {
  type: 'Dentist',
  created: {
    by: 'Levent Gurses',
    date: moment().format('MM/DD/YYYY')
  }
}

function* process(data, resourceName, outputPath, pugify) {

  const html = pugify({
    data: Object.assign({}, NONEXISTENT_DATA, data, {
      reviewCardData: data
    })
  });
  const fileName = `${outputPath}/${data.key}.html`;
  yield Fs.writeFileAsync(fileName, html);
}
