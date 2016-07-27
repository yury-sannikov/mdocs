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
const metainfo = require('./metalsmith-metainfo');
const path = require('path');


const CURRENT_THEME = 'cleanui';
const THEME_DIR = path.join(__dirname, 'themes', CURRENT_THEME)
const SOURCE_PATH = path.join(__dirname, '..', 'content/src')
const WORK_DIR = path.join(__dirname, '..')
const BUILD_DIR = path.join(__dirname, '..', '__build')

const build = (clean = false) => (done) => {
  console.log(`Building. clean: ${clean}.`);
  measure.start('build');

  const helpers = {
    _: require('lodash')
  }

  Metalsmith(WORK_DIR)
    // Folder with source data
    .source(SOURCE_PATH)
    // Folder with results
    .destination(BUILD_DIR)
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
          src: path.join('engine/themes', CURRENT_THEME, 'assets'),
          dest: 'assets',
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
      source_path: path.join(SOURCE_PATH, 'data/')
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
    .use(metainfo({
      metainfoPath: path.join(SOURCE_PATH, '../metainfo'),
      includeForMetaOnly: ['menu', 'practice'],
      outputFile: path.join(BUILD_DIR, 'metainfo.json')
    }))

    // PUG/Jade layouts system
    .use(layouts({
      engine: 'pug',
      layoutPattern: '*.pug',
      pretty: true,
      directory: path.join(THEME_DIR, 'layouts'),
      helpers
    }))
    .use(inplace({
      engine: 'handlebars',
      partials: 'content/partials'
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
  var serve = new nodeStatic.Server(BUILD_DIR);
  require('http').createServer((req, res) => {
    req.addListener('end', () => serve.serve(req, res));
    req.resume();
  }).listen(8080);

  // Quick build if src changed
  watch(path.join(SOURCE_PATH, '**/*'), { ignoreInitial: true }, build(false));
  // Full Rebuild if layout changed
  watch(path.join(THEME_DIR, 'layouts/**/*'), { ignoreInitial: true }, build(true));
  watch(path.join(THEME_DIR, '/partials/**/*'), { ignoreInitial: true }, build(true));
  watch(path.join(THEME_DIR, '/assets/**/*'), { ignoreInitial: true }, build(true));

  //open('http://localhost:8080');
});

