const Metalsmith = require('metalsmith');
const changed = require('metalsmith-changed');
const livereload = require('metalsmith-livereload');
const nodeStatic = require('node-static');
const watch = require('glob-watcher');
const open = require('open');
const include = require('metalsmith-include');
const layouts = require('metalsmith-layouts');
const measure = require('hrtime-measure');
const renamer = require('metalsmith-renamer');
const msIf = require('metalsmith-if');
const asset = require('metalsmith-static');



const DIR = __dirname + '/src/';

function renamePugToHtml(files, metalsmith, done)  {
  Object.keys(files).forEach(function(file) {
    if (file.indexOf('.pug') !== -1) {
      const newName = file.replace('.pug', '.html');
      files[newName] = files[file];
      delete files[file];
    }
  });
  done();
}

const build = (clean = false) => (done) => {
  console.log(`Building. clean: ${clean}.`);
  measure.start('build');

  Metalsmith(__dirname)
    .source('./src')
    .destination('./__build')
    .clean(clean)
    .use(
      msIf(clean,
        asset({
          src: './public',
          dest: './'
        }))
    )
    .use(changed())
    .use(include({
      deletePartials: true
    }))
    .use(layouts({
      engine: 'pug',
      layoutPattern: '*.pug',
      pretty: true,
      helpers: {
        _: require('lodash')
      }
    }))
    .use(livereload({ debug: true }))
    .build((err, files) => {
      if (err) {
        done(err);
        return;
      }
      let filenames = Object.keys(files).join(', ');
      measure.end('build', filenames, true);
      done(err);
    });
};

build(true)((err) => {
  if (err) {
    console.log(err);
    return;
  }
  var serve = new nodeStatic.Server(__dirname + '/__build');
  require('http').createServer((req, res) => {
    req.addListener('end', () => serve.serve(req, res));
    req.resume();
  }).listen(8080);

  // Quick build if src changed
  watch(__dirname + '/src/**/*', { ignoreInitial: true }, build(false));
  // Rebuild if layout changed
  watch(__dirname + '/layouts/**/*', { ignoreInitial: true }, build(true));
  watch(__dirname + '/partials/**/*', { ignoreInitial: true }, build(true));

  //open('http://localhost:8080');
});

