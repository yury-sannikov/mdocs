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
const markdown = require('metalsmith-markdown');



const DIR = __dirname + '/src/';

const build = (clean = false) => (done) => {
  console.log(`Building. clean: ${clean}.`);
  measure.start('build');

  Metalsmith(__dirname)
    // Folder with source data
    .source('./src')
    // Folder with results
    .destination('./__build')
    // Clean result folder if 'clean' is true.
    // Do full clean if layout or partial has been changed
    .clean(clean)
    .use(
      // If clean build, copy over assets from public folder
      msIf(clean,
        asset({
          src: './public',
          dest: './'
        }))
    )
    // Track file changes in 'src' folder. Pass down only changed file to reduce build time
    // Temporarely disabled as has a conflict with metalsmith-include plugin
    // Can be improved by checking metalsmith-include dependencies and update ctime
    //.use(changed())
    // Markdown Syntax
    .use(markdown({
      smartypants: true,
      gfm: true,
      tables: true
    }))
    // Allow to include markdown files into JADE
    .use(include({
      deletePartials: true
    }))
    // PUG/Jade layouts system
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
  // Full Rebuild if layout changed
  watch(__dirname + '/layouts/**/*', { ignoreInitial: true }, build(true));
  watch(__dirname + '/partials/**/*', { ignoreInitial: true }, build(true));

  //open('http://localhost:8080');
});

