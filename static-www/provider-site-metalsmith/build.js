const Metalsmith = require('metalsmith');
const changed = require('metalsmith-changed');
const livereload = require('metalsmith-livereload');
const nodeStatic = require('node-static');
const watch = require('glob-watcher');
const open = require('open');
const include = require('metalsmith-include');
const layouts = require('metalsmith-layouts');
const measure = require('hrtime-measure');


const DIR = __dirname + '/src/';

const build = (clean = false) => (done) => {
  console.log(`Building. clean: ${clean}.`);
  measure.start('build');

  Metalsmith(__dirname)
    .source('./src')
    .destination('./__build')
    .clean(clean)
    .use(changed())
    .use(include({
      deletePartials: true
    }))
    .use(layouts({
      engine: 'pug',
      layoutPattern: '*.pug',
      partials: 'partials',
      pretty: true,
      helpers: {
        _: require('lodash')
      }
    }))
    .use(livereload({ debug: true }))
    .build((err, files) => {
      let filenames = Object.keys(files).join(', ');
      measure.end('build', filenames, true);
      done(err);
    });
};

build(true)(() => {
  var serve = new nodeStatic.Server(__dirname + '/__build');
  require('http').createServer((req, res) => {
    req.addListener('end', () => serve.serve(req, res));
    req.resume();
  }).listen(8080);

  // Quick build if src changed
  watch(__dirname + '/src/**/*', { ignoreInitial: true }, build(false));
  // Rebuild if layout changed
  watch(__dirname + '/layouts/**/*', { ignoreInitial: true }, build(true));

  open('http://localhost:8080');
});

