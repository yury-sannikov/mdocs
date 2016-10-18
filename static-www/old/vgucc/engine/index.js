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
const rimraf = require('rimraf')

function helpersFactory() {
  return {
    _: require('lodash')
  }
}
function metalsmithFactory(workDir, buildDir, options) {
    // console.log(workDir, buildDir, options)

  const sourceDir = path.join(workDir, options.source)
  const themeDir = path.join(workDir, 'themes', options.theme)
  return Metalsmith(workDir)
    // Folder with source data
    .source(sourceDir)
    // Folder with results
    .destination(buildDir)
    // Clean result folder if 'clean' is true.
    // Do full clean if layout or partial has been changed
    .clean(options._clean)
    // Inject metadata from JSON files into context.
    .use(metadata({
      practice: 'data/practice.json',
      menu: 'data/menu.json',
      contents: 'data/contents.json',
      reviews: 'data/reviews.json'
    }))
    .use(
      // If clean build, copy over assets from public folder
      msIf(options._clean,
        asset({
          src: path.join('themes', options.theme, 'assets'),
          dest: 'assets',
        }))
    )
    // Dependency tracking for metalsmith-include. Set ctime for all dependent files to the latest value of the group
    .use(dep())
    // Track file changes in 'src' folder. Pass down only changed file to reduce build time
    // Temporarely disabled as has a conflict with metalsmith-include plugin
    // Can be improved by checking metalsmith-include dependencies and update ctime
    .use(msIf(!options._force, changed()))
    // Markdown Syntax
    .use(msIf(options._generate,
      markdown({
        smartypants: true,
        gfm: true,
        tables: true
      }))
    )
    // Allow to include markdown files into JADE
    .use(include({
      deletePartials: true
    }))
    .use(jsonToFiles({
      source_path: path.join(workDir, options.dataFolder, '/')
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
      metainfoPath: path.join(workDir, options.metainfo),
      includeForMetaOnly: ['menu', 'practice'],
      outputFile: path.join(buildDir, 'metainfo.json')
    }))

    // PUG/Jade layouts system
    .use(msIf(options._generate,
      layouts({
        engine: 'pug',
        layoutPattern: '*.pug',
        pretty: true,
        directory: path.join(themeDir, 'layouts'),
        helpers: helpersFactory()
      }))
    )
    .use(msIf(options._generate,
      inplace({
        engine: 'handlebars',
        partials: 'partials'
      }))
    )
}

class SiteBuilderEngine {
  constructor(workDir, buildDir, options) {
    this.workDir = workDir
    this.buildDir = buildDir
    this.options = Object.assign({}, {
      metainfo: 'metainfo',
      partials: 'partials',
      source: 'src',
      dataFolder: 'src/data',
      theme: 'urgemedical'
    }, options)
  }

  prepare(done) {
    const ms = metalsmithFactory(this.workDir, this.buildDir, Object.assign({}, this.options, {
      _clean: true,
      _force: false,
      _generate: false
    }))
    ms.build(done)
  }

  generate(force, done) {
    const ms = metalsmithFactory(this.workDir, this.buildDir, Object.assign({}, this.options, {
      _clean: false,
      _generate: true,
      _force: force
    }))
    ms.build(done)
  }

  publish(done) {
    const ms = metalsmithFactory(this.workDir, this.buildDir, Object.assign({}, this.options, {
      _clean: true,
      _generate: true,
      _force: true
    }))
    ms.build((err, files) => {
      if (err) {
        done(err, files)
        return
      }
      rimraf(`${this.buildDir}{/metainfo.json,/data}`, (e) => {
        done(err, files)
      })
    })
  }

  cliDev(port, buildResult) {
    const me = this
    const ms = metalsmithFactory(this.workDir, this.buildDir, Object.assign({}, this.options, {
      _clean: true,
      _generate: true,
      _force: false
    }))

    ms
      .use(livereload({ debug: true }))
      .build((err, files) => {
        if (err) {
          buildResult(err, files)
          return
        }
        buildResult(err, files)

        var serve = new nodeStatic.Server(this.buildDir);
        require('http').createServer((req, res) => {
          req.addListener('end', () => serve.serve(req, res));
          req.resume();
        }).listen(port);

        console.log(`Serving HTTP on port ${port}`)

        const build = function build(force) {
          return (done) => {
            console.log(`Rebuild. Force = ${force}`)

            metalsmithFactory(me.workDir, me.buildDir, Object.assign({}, me.options, {
              _clean: false,
              _generate: true,
              _force: force
            }))
            .use(livereload({ debug: true }))
            .build((err, files) => {
              buildResult(err, files)
              done()
            })
          }
        }
        const themeDir = path.join(this.workDir, 'themes', this.options.theme)
        // Quick build if src changed
        watch(path.join(this.workDir, this.options.source, '**/*'), { ignoreInitial: true }, build(false));
        // Full Rebuild if layout changed
        watch(path.join(this.workDir, this.options.partials, '**/*'), { ignoreInitial: true }, build(true));
        watch(path.join(themeDir, 'layouts/**/*'), { ignoreInitial: true }, build(true));
        watch(path.join(themeDir, 'partials/**/*'), { ignoreInitial: true }, build(true));
        watch(path.join(themeDir, 'assets/**/*'), { ignoreInitial: true }, build(true));
      })
  }


}


module.exports = SiteBuilderEngine
