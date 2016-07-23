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
const jsonToFiles = require('metalsmith-json-to-files');
const collections = require('metalsmith-collections');
const permalinks = require('metalsmith-permalinks');
const metadata = require('metalsmith-metadata');
const dep = require('./metalsmith-include-dependency');
const inplace = require('metalsmith-in-place');
const evalLayout = require('./metalsmith-eval-layout');

const DIR = __dirname + '/src/';
const THEME_DIR = '/themes/'
const CURRENT_THEME = 'cleanui';

const build = (clean = false) => (done) => {
  console.log(`Building. clean: ${clean}.`);
  measure.start('build');

  const helpers = {
    _: require('lodash')
  }

  Metalsmith(__dirname)
    // Folder with source data
    .source('./src')
    // Folder with results
    .destination('./__build')
    // Clean result folder if 'clean' is true.
    // Do full clean if layout or partial has been changed
    .clean(clean)
    // Inject metadata from JSON files into context.
    .use(metadata({
      practice: 'data/practice.json',
      menu: 'data/menu.json',
      contents: 'data/contents.json',
      reviews: 'data/reviews.json',
      testimonials: 'data/testimonials.json'
    }))
    .use(
      // If clean build, copy over assets from public folder
      msIf(clean,
        asset({
          src: THEME_DIR + CURRENT_THEME + '/assets',
          dest: './assets'
        }))
    )
    // Dependency tracking for metalsmith-include. Set ctime for all dependent files to the latest value of the group
    .use(dep())
    // Track file changes in 'src' folder. Pass down only changed file to reduce build time
    // Temporarely disabled as has a conflict with metalsmith-include plugin
    // Can be improved by checking metalsmith-include dependencies and update ctime
    .use(changed())
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
    .use(jsonToFiles({
      source_path: 'src/data/'
    }))
    .use(collections({
      providers: {},
      services: {},
      contents: {}
    }))
    .use(permalinks({
      relative: false,
      date: 'YYYY',
      linksets: [{
          match: { collection: 'blogposts' },
          pattern: 'blog/:date/:title',
          date: 'mmddyy'
      }]
    }))
    // If eval_layout is true, treat layout as a field containing computable value
    .use(evalLayout())
    // PUG/Jade layouts system
    .use(layouts({
      engine: 'pug',
      layoutPattern: '*.pug',
      pretty: true,
      directory: __dirname + THEME_DIR + CURRENT_THEME + '/layouts',
      helpers
    }))
    .use(inplace({
      engine: 'handlebars',
      partials: 'partials'
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
  watch(__dirname + THEME_DIR + CURRENT_THEME + '/layouts/**/*', { ignoreInitial: true }, build(true));
  watch(__dirname + THEME_DIR + CURRENT_THEME + '/partials/**/*', { ignoreInitial: true }, build(true));
  watch(__dirname + THEME_DIR + CURRENT_THEME + '/assets/**/*', { ignoreInitial: true }, build(true));

  //open('http://localhost:8080');
});

