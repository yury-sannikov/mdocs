import _ from 'lodash';
import JSONStream from 'JSONStream';
import cs from 'co-stream';

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
  return inputStream
    .pipe(JSONStream.parse(selector || '*'))
    .pipe(cs.map(function* (data) {
      return yield process(data, resourceName, outputPath);
    },{ objectMode: true, parallel: 1 }));
}

function* process(data, resourceName, outputPath) {

}
