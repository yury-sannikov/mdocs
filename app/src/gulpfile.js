(function () {
  'use strict';

  // Install: you must install gulp both globally *and* locally.
  // Make sure you `$ npm install -g gulp`

  /**
   * Dependencies
   */

  var $             = require('gulp-load-plugins')({ lazy: true });
  var psi           = require('psi');
  var del           = require('del');
  var gulp          = require('gulp');
  var pngquant      = require('imagemin-pngquant');
  var terminus      = require('terminus');
  var runSequence   = require('run-sequence');
  var babel         = require('gulp-babel');
  var path          = require('path');

  /**
   * Banner
   */

  var pkg = require('./package.json');
  var banner = [
    '/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.licenses[0].type %>',
    ' */',
    ''
  ].join('\n');

  /**
   * Paths
   */

  var paths = {
    clean: [
      'public/app/*'
    ],
    js: [
      // ============= Bootstrap  ================
      // Enable/disable as needed but only turn on
      // .js that is needed on *every* page. No bloat!
      // =========================================
      'public/app/lib/bootstrap/js/transition.js',
      'public/app/lib/bootstrap/js/alert.js',
      // 'public/lib/bootstrap/js/button.js',
      // 'public/lib/bootstrap/js/carousel.js',
      'public/app/lib/bootstrap/js/collapse.js',
      'public/app/lib/bootstrap/js/dropdown.js',
      // 'public/lib/bootstrap/js/modal.js',
      'public/app/lib/bootstrap/js/tooltip.js',
      'public/app/lib/bootstrap/js/popover.js',
      // 'public/lib/bootstrap/js/scrollspy.js',
      // 'public/lib/bootstrap/js/tab.js',
      // 'public/lib/bootstrap/js/affix.js'
      // =========================================
      'public/app/oneui/assets/js/core/jquery.slimscroll.min.js',
      'public/app/oneui/assets/js/core/jquery.scrollLock.min.js',
      'public/app/oneui/assets/js/core/jquery.appear.min.js',
      'public/app/oneui/assets/js/core/jquery.countTo.min.js',
      'public/app/oneui/assets/js/core/jquery.placeholder.min.js',
      // =========================================
      'public/app/lib/fastclick/lib/fastclick.js',
      'public/app/lib/chosen/chosen.jquery.js',
      'public/app/js/main.js'
    ],
    widgetsjs: [
      'src/widgets/widgets.js'
    ],
    lint: [
      'config/**/*.js',
      'test/**/*.js',
      'controllers/**/*.js',
      'models/**/*.js',
      'app.js',
      'app_cluster.js',
      'gulpfile.js'
    ],
    less: [
      '../assets/less/bootstrap.less',
      '../assets/less/main.less',
      '../assets/less/page-api.less',
      '../assets/less/page-colors.less',
      '../assets/less/page-dashboard.less',
      '../assets/less/page-privacy.less',
      '../assets/less/page-react.less'
    ],
    npm: [
      'node_modules/json-editor/dist/jsoneditor.min.js',
      'node_modules/card/dist/jquery.card.js',
      'node_modules/jqtree/tree.jquery.js'
    ],
    sitebuilderjs: [
      'public/app/js/sitebuilder.js'
    ],
    stuff: [
      {
        from: '../assets/lib/**/*',
        to: './public/app/lib',
      },
      {
        from: '../assets/froala/**/*',
        to: './public/app/froala',
      },
      {
        from: '../assets/js/**/*',
        to: './public/app/js',
      },
      {
        from: '../assets/oneui/**/*',
        to: './public/app/oneui',
      },
    ]
  };

  /**
   * Clean
   */

  gulp.task('clean', function () {
    return del(paths.clean);
  });

  gulp.task('copy-stuff', function () {
    var tasks = paths.stuff.map(function(item) {
      return gulp.src(item.from).pipe(gulp.dest(item.to));
    })
    return tasks
  });

  /**
   * Process CSS
   */

  gulp.task('styles', function () {
    return gulp.src(paths.less, {
          base: '../assets/less/'
        }
      )
      .pipe($.less({
        strictMath: true
      }))     // Compile Less files
      .pipe($.autoprefixer({                  // Autoprefix for target browsers
        browsers: ['last 2 versions'],
        cascade: true
      }))
      .pipe($.csscomb())                      // Coding style formatter for CSS
      .pipe($.csslint('.csslintrc'))          // Lint CSS
      .pipe($.csslint.reporter())             // Report issues
      .pipe($.rename({ suffix: '.min' }))     // Add .min suffix
      .pipe($.csso())                         // Minify CSS
      // .pipe($.header(banner, { pkg : pkg }))  // Add banner
      .pipe($.size({ title: 'CSS:' }))        // What size are we at?
      .pipe(gulp.dest('./public/app/css'))    // Save minified CSS
      .pipe($.livereload());                // Initiate a reload
  });

  /**
   * Process Scripts
   */

  gulp.task('scripts', function () {
    return gulp.src(paths.js)                 // Read .js files
      .pipe($.concat(pkg.name + '.js'))       // Concatenate .js files
      .pipe(gulp.dest('./public/app/js'))     // Save main.js here
      .pipe($.rename({ suffix: '.min' }))     // Add .min suffix
      .pipe($.uglify({ outSourceMap: true })) // Minify the .js
      // .pipe($.header(banner, { pkg : pkg }))  // Add banner
      .pipe($.size({ title: 'JS:' }))         // What size are we at?
      .pipe(gulp.dest('./public/app/js'));     // Save minified .js
      // .pipe($.livereload());                  // Initiate a reload
  });

  gulp.task('sitebuilderjs', function () {
    return gulp.src(paths.sitebuilderjs)
      .pipe($.rename({ suffix: '.min' }))
      .pipe($.uglify({ outSourceMap: false }))
      .pipe(gulp.dest('./public/app/js'));
  });

  /**
   * Process NPM Scripts
   */

  gulp.task('npmscripts', function () {
    return gulp.src(paths.npm)
      .pipe($.uglify({ outSourceMap: false }))
      .pipe(gulp.dest('./public/app/js'));
  });

  /**
   * Process Widget Scripts
   */

  gulp.task('widgets', function () {
    return gulp.src(paths.widgetsjs)
      .pipe($.concat('widgets.js'))
      .pipe(babel({
        presets: ['es2015', 'stage-0']
      }))
      .pipe(gulp.dest('./public/app/js'))
      .pipe($.rename({ suffix: '.min' }))
      .pipe($.uglify({ outSourceMap: false }))
      .pipe($.size({ title: 'JS:' }))
      .pipe(gulp.dest('./public/app/js'));
  });

  /**
   * Process Images
   */

  gulp.task('images', function () {
    return gulp.src('../assets/images/**/*')            // Read images
      .pipe($.changed('./public/app/img'))    // Only process new/changed
      .pipe($.imagemin({                      // Compress images
        progressive: true,
        optimizationLevel: 3,
        interlaced: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
      }))
      .pipe(gulp.dest('./public/app/img'));   // Write processed images
  });

  /**
   * JSHint Files
   */

  gulp.task('lint', function () {
    return gulp.src(paths.lint)               // Read .js files
      .pipe($.jshint())                       // lint .js files
      .pipe($.jshint.reporter('jshint-stylish'));
  });

  /**
   * JSCS Files
   */

  gulp.task('jscs', function () {
    return gulp.src(paths.lint)               // Read .js files
      .pipe($.jscs())                         // jscs .js files
      .on('error', function (e) {
        $.util.log(e.message);
        $.jscs().end();
      })
      .pipe(terminus.devnull({ objectMode: true }));
  });

  /**
   * Build Task
   *   - Build all the things...
   */

  gulp.task('build', function (cb) {
    runSequence(
      'clean',                                // first clean
      ['lint', 'jscs', 'copy-stuff'],                       // then lint and jscs in parallel
      ['styles', 'scripts', 'npmscripts', 'sitebuilderjs', 'widgets', 'images'],        // etc.
      cb);
  });

  /**
   * Nodemon Task
   */

  gulp.task('nodemon', ['build'], function (cb) {
    $.livereload.listen();
    var called = false;
    $.nodemon({
      script: 'src/index.js',
      verbose: false,
      env: { 'NODE_ENV': 'development', 'DEBUG': 'skeleton' },
      // nodeArgs: ['--debug']
      ext: 'js',
      ignore: [
        'gulpfile.js',
        'public/',
        'views/',
        'less/',
        'node_modules/'
      ]
    })
    .on('start', function () {
      setTimeout(function () {
        if (!called) {
          called = true;
          cb();
        }
      }, 3030);  // wait for start
    })
    .on('restart', function () {
      setTimeout(function () {
        $.livereload.changed('/');
      }, 3030);  // wait for restart
    });
  });

  /**
   * Open the browser
   */

  gulp.task('open', ['nodemon'], function () {
    gulp.src('')
      .pipe($.open({ uri: 'http://localhost:3030/app' }));
  });

  /**
   * Default Task
   */

  gulp.task('default', ['open'], function () {
    gulp.watch(paths.less, ['styles']);
    gulp.watch(paths.js, ['scripts']);
    gulp.watch(paths.lint, ['lint']);
    gulp.watch('views/**/*.jade').on('change', $.livereload.changed);
  });

  /**
   * Run PageSpeed Insights
   */

  // When using this module for a production-level build process,
  // registering for an API key from the Google Developer Console
  // is recommended.

  var site = 'skeleton-app.jit.su';

  gulp.task('mobile', function (cb) {
    // output a formatted report to the terminal
    psi.output(site, {
      strategy: 'mobile',
      locale: 'en_US',
      threshold: 70
    }, cb);
  });

  gulp.task('desktop', ['mobile'], function (cb) {
    // output a formatted report to the terminal
    psi.output(site, {
      strategy: 'desktop',
      locale: 'en_US',
      threshold: 80
    }, cb);
  });

  gulp.task('pagespeed', ['desktop']);
}());
