# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON

#Import
moment = require('moment')
_ = require('lodash')

docpadConfig = {

  # =================================
  # Paths Configuration

  # Root Path
  # The root path of our our project
  rootPath: process.cwd()  # default

  # Watch options
  watchOptions:
    catchupDelay: 0
    preferredMethods: ['watchFile', 'watch']


  # Package Path
  # The project's package.json path
  # If it is a relative path, it will have the resolved `rootPath` prepended to it
  packagePath: 'package.json'  # default

  # Config Paths
  # An array of paths that we try to extract our docpad configuration from
  configPaths: [  # default
      'docpad.js'
      'docpad.coffee'
      'docpad.json'
      'docpad.cson'
  ]

  # Plugin Paths
  # An array of special paths which to load single plugins from
  # (e.g., ['/a/path/to/a/docpad-plugin-special'])
  pluginPaths: []  # default

  # Plugins Paths
  # An array of paths which to load multiple plugins from
  pluginsPaths: [  # default
    'node_modules'
    'plugins'
  ]

  plugins:
    sitemap:
      cachetime: 600000
      changefreq: 'daily'
      priority: 0.5
      filePath: 'sitemap.xml'
      collectionName: 'sitemapPages'
    cleanurls:
      static: true
    livereload:
      enabled: false

  # Reload Paths
  # An array of special paths that when changes occur in, we reload our configuration
  reloadPaths: ['files', 'layouts', 'render', 'static', 'partials']  # default

  # Regenerate Paths
  # An array of special paths that when changes occur in, we regenerate our website
  regeneratePaths: ['files', 'layouts', 'render', 'static', 'partials']  # default

  # Regenerate Delay
  # The time (in milliseconds) to wait after a source file has
  # changed before using it to regenerate. Updating over the
  # network (e.g., via FTP) can cause a page to be partially
  # rendered as the page is regenerated *before* the source file
  # has completed updating: in this case increase this value.
  regenerateDelay: 0   # default

  # Out Path
  # Where should we put our generated website files?
  # If it is a relative path, it will have the resolved `rootPath` prepended to it
  outPath: 'public'  # default

  # Src Path
  # Where can we find our source website files?
  # If it is a relative path, it will have the resolved `rootPath` prepended to it
  srcPath: 'src'  # default

  # Documents Paths
  # An array of paths which contents will be treated as documents
  # If it is a relative path, it will have the resolved `srcPath` prepended to it
  documentsPaths: [
    'render'
    'documents'
  ]

  # Files Paths
  # An array of paths which contents will be treated as files
  # If it is a relative path, it will have the resolved `srcPath` prepended to it
  filesPaths: [  # default
      'static'
      'files'
      'public'
  ]

  # Layouts Paths
  # An array of paths which contents will be treated as layouts
  # If it is a relative path, it will have the resolved `srcPath` prepended to it
  layoutsPaths: [  # default
      'layouts'
  ]

  # Ignore Paths
  # Can be set to an array of absolute paths that we should ignore from the scanning process
  ignorePaths: false  # default

  # Ignore Hidden Files
  # Whether or not we should ignore files that start with a dot from the scanning process
  ignoreHiddenFiles: false  # default

  # Ignore Common Patterns
  # Whether or not we should ignore commonly undesired files from the scanning process
  # (e.g., .DStore, thumbs.db, .git, files that start with a tilda, etc.)
  ignoreCommonPatterns: true  # default

  # Ignore Custom Patterns
  # Can be set to a regex of custom patterns to ignore from the scanning process
  ignoreCustomPatterns: false  # default


  # =================================
  # Server Configuration

  # Port
  # Use to change the port that DocPad listens to
  # By default we will detect the appropriate port number for our environment
  # if no environment port number is detected we will use 9778 as the port number
  # Checked environment variables are:
  # - PORT - Heroku, Nodejitsu, Custom
  # - VCAP_APP_PORT - AppFog
  # - VMC_APP_PORT - CloudFoundry
  port: null  # default

  # Max Age
  # The default caching time limit that is sent with the response to the client
  # Can be set to `false` to disable caching
  maxAge: 86400000   # default

  # Server Express
  # The Express.js instance that we want DocPad to use
  # If not set, we will create our own
  serverExpress: null  # default

  # Server HTTP
  # The Node.js HTTP server instance that we want DocPad to use
  # If not set, we will create our own
  serverHttp: null  # default


  # =================================
  # Middleware Configuration
  # Which middlewares would you like us to activate
  # Setting `extendServer` to `false` will set all of these to `false` automatically

  # Extend Server
  # Whether or not we should extend the server with our custom middleware
  extendServer: true  # default

  # The standard middlewares (bodeParser, methodOverride, Express router)
  middlewareStandard: true  # default

  # The standard bodyParser middleware
  middlewareBodyParser: true  # default

  # The standard methodOverride middleware
  middlewareMethodOverride: true  # default

  # The standard Express router middleware
  middlewareExpressRouter: true  # default

  # Our own 404 middleware
  middleware404: true  # default

  # Our own 500 middleware
  middleware500: true  # default


  # =================================
  # Logging Configuration

  # Log Level
  # Up to which level of logging should we output
  logLevel: (if ('-d' in process.argv) then 7 else 6)  # default

  # Logger
  #  The caterpillar instance that we want to use
  # If not set, we will create our own
  logger: null  # default

  # Growl
  # Whether or not we should display system notifications as things progress within DocPad
  growl: true  # default

  # Catch Exceptions
  # Whether or not DocPad should catch uncaught exceptions
  catchExceptions: true  # default

  # Report Errors
  # Whether or not we should report errors back to the DocPad Team
  reportErrors: process.argv.join('').indexOf('test') is -1  # default (don't enable if we are running inside a test)

  # Report Statistics
  # Whether or not we should report statistics back to the DocPad Team
  reportStatistics: process.argv.join('').indexOf('test') is -1  # default (don't enable if we are running inside a test)

  # Airbrake Token
  # The airbrake token we should use for reporting errors
  # By default, uses the DocPad Team's token
  airbrakeToken: null  # default

  # MixPanel Token
  # The mixpanel token we should use for reporting statistics
  # By default, uses the DocPad Team's token
  mixpanelToken: null  # default


  # =================================
  # Other Configuration

  # Detect Encoding
  # Should we attempt to auto detect the encoding of our files?
  # Useful when you are using foreign encoding (e.g., GBK) for your files
  # Only works on unix systems currently (limit of iconv module)
  detectEncoding: false

  # Render Single Extensions
  # Whether or not we should render single extensions by default
  renderSingleExtensions: false  # default

  # Render Passes
  # How many times should we render documents that reference other documents?
  renderPasses: 1  # default

  # Check Version
  # Whether or not to check for newer versions of DocPad
  checkVersion: false  # default

  # Welcome
  # Whether or not we should display any custom welcome callbacks
  welcome: false  # default

  # Prompts
  # Whether or not we should display any prompts
  prompts: false  # default

  # Helper Url
  # Used for subscribing to newsletter, account information, and statistics, etc.
  helperUrl: 'https://docpad.org/helper/'  # default

  # Safe Mode
  # If enabled, we will try our best to sandbox our template rendering so that they cannot modify things outside of them
  # Not yet implemented
  safeMode: false  # default

  # Collections
  # A hash of functions that create collections
  collections: {}  # default

  # Regenerate Every
  # Performs a regenerate every x milliseconds, useful for always having the latest data
  regenerateEvery: false  # default

  # Collections
  # ===========
  # These are special collections that our website makes available to us

  collections:
    # For instance, this one will fetch in all documents that have pageOrder set within their meta data
    pages: (database) ->
      database.findAllLive({pageOrder: $exists: true}, [pageOrder:1,title:1])

    mainLevelPages: (database) ->
      database.findAllLive({pageOrder: $exists: true}, [pageOrder:1,title:1])

    # This one, will fetch in all documents with the blog layout
    posts: (database) ->
      database.findAllLive( layout:'blog', [eventDate:-1] )

    # Tags
    tags: (database) ->
      @getFilesAtPath('tags/')

    # Pages displayed in the main menu
    menuPages: (database) ->
      database.findAllLive({ isPage:true },[{pageOrder:1}])

    # Sitemap index collection
    sitemapPages: (database) ->
      database.findAllLive({ isSitemap:true })

    # All events, ascending
    eventsAsc: (database) ->
      database.findAllLive( layout:'event', [eventDate:1] )

    # All events, descending
    eventsDesc: (database) ->
      database.findAllLive( layout:'event', [eventDate:-1] )

    # Upcoming events
    upcomingEvents: (database) ->
      @getCollection("eventsAsc")
        .createLiveChildCollection()
        .setFilter("upcoming", (event, searchString) ->
          return moment(event.get("eventDate"), "YYYY-MM-DD h:mm a").add(6, 'hours').diff(moment()) > 0
        )
        .query()

    # Past events
    pastEvents: (database) ->
      @getCollection("eventsDesc")
        .createLiveChildCollection()
        .setFilter("upcoming", (event, searchString) ->
          return moment(event.get("eventDate"), "YYYY-MM-DD h:mm a").add(6, 'hours').diff(moment()) < 0
        )
        .query()


  # DocPad Events
  # =============

  # Here we can define handlers for events that DocPad fires
  # You can find a full listing of events on the DocPad Wiki
  events:

    # Server Extend
    # Used to add our own custom routes to the server before the docpad routes are added
    serverExtend: (opts) ->
      # Extract the server from the options
      {server} = opts
      docpad = @docpad

      # As we are now running in an event,
      # ensure we are using the latest copy of the docpad configuraiton
      # and fetch our urls from it
      latestConfig = docpad.getConfig()
      oldUrls = latestConfig.templateData.site.oldUrls or []
      newUrl = latestConfig.templateData.site.url

      # Redirect any requests accessing one of our sites oldUrls to the new site url
      server.use (req,res,next) ->
        if req.headers.host in oldUrls
          res.redirect 301, newUrl+req.url
        else
          next()

  # =================================
  # Environment Configuration

  # Locale Code
  # The code we shall use for our locale (e.g., `en`, `fr`, etc.)
  # If not set, we will attempt to detect the system's locale, if the locale can't be detected or if our locale file is not found for it, we will revert to `en`
  localeCode: null  # default

  # Environment
  # Which environment we should load up
  # If not set, we will default the `NODE_ENV` environment variable, if that isn't set, we will default to `development`
  env: null  # default

  # Environments
  # Allows us to set custom configuration for specific environments
  environments:  # default
    development:  # default
      # Always refresh from server
      maxAge: false  # default

      # Only do these if we are running standalone via the `docpad` executable
      checkVersion: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default
      welcome: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default
      prompts: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default

      # Listen to port 9005 on the development environment
      port: 8080  # example

      # templateData:
      #   site:
      #     url: 'http://localhost:3000'
      enabledPlugins:  # example
        tags: false
    gen:
      port: 9090
      enabledPlugins:  # example
        tags: false
}

# Read customer-related configuration items and apply it to the docpad configuration
customExtensions = require('./src/docpad.js')

# Export the DocPad Configuration
module.exports = _.assignIn(docpadConfig, customExtensions)
