var _ = require("lodash");
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var argv = require('yargs').argv;
var cssLoaders, plugins;
var appRoot = path.resolve(__dirname, "./assetsSource");
var node_modules_dir = path.join(__dirname, 'node_modules');
var zlib = require('zlib');
var CompressionPlugin = require("compression-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

function gzipMaxCompression(buffer, done) {
  return zlib.gzip(buffer, { level: 9 }, done)
}

argv.env = argv.env || 'development';

var production = !!process.env['PRODUCTION'];

cssLoaders = [
  { test: /\.css$/,    loader: ExtractTextPlugin.extract("style-loader", "css-loader?root="+appRoot) },
  { test: /\.less$/,    loader: ExtractTextPlugin.extract("style-loader", "css-loader?root="+appRoot+"!less-loader") },
  { test: /\.scss$/,    loader: ExtractTextPlugin.extract("style-loader","css-loader?root="+appRoot+"!sass") },
  { test: /\.styl$/,    loader: ExtractTextPlugin.extract("style-loader","css-loader?root="+appRoot+"!stylus-loader") }
];

plugins = [
  new ExtractTextPlugin("[name].css")
];

var deps = [
];

var config = {
  addVendor: function (name, path) {
    config.resolve.alias[name] = path;
    config.module.noParse.push(path);
    config.__karma_sources.push(path);
  },
  cache: true,
  debug: true,
  devTool: 'eval',
  entry: {
    app: [
      'styles.js',
      'images.js'
    ],
    custom: [
      'scripts.js'
    ]
  },
  output: {
    path: path.join(__dirname, "assets"),
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle.js"
  },
  module: {
    noParse: [],
    loaders: cssLoaders.concat([
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: [
          'file?hash=sha512&digest=hex&name=[name].[ext]',
          'image-webpack'
        ]
      },
      { test: /\.woff($|\?)/,   loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
      { test: /\.woff2($|\?)/,   loader: 'url-loader?prefix=font/&limit=5000&mimetype=application/font-woff' },
      { test: /\.ttf($|\?)/,    loader: "file-loader?prefix=font/" },
      { test: /\.eot($|\?)/,    loader: "file-loader?prefix=font/" },
      { test: /\.svg($|\?)/,    loader: "file-loader" },
    ])
  },
  imageWebpackLoader: {
    mozjpeg: {
      quality: 55
    },
    pngquant:{
      quality: "65-90",
      speed: 4
    },
    svgo:{
      plugins: [
        {
          removeViewBox: false
        },
        {
          removeEmptyAttrs: false
        }
      ]
    }
  },
  resolve: {
    root: [
      path.join(__dirname, 'assetsSource'),
      path.join(__dirname, 'node_modules'),
    ],
    moduleDirectories: [
    ],
    alias: {
    }
  },
  externals: {
  },
  plugins: skipFalsy(plugins.concat([
    new webpack.ProvidePlugin({
    }),
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(
        'bower.json', ['main'])
    ),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['app'],
      minChunks: Infinity
    }),
    new CopyWebpackPlugin([
      { from: './assetsSource/js/lib', to: 'lib' },
      { from: './assetsSource/video', to: 'video' },
      { from: './assetsSource/svg', to: 'svg' }
    ]),
    // production && new CompressionPlugin({
    //     algorithm: gzipMaxCompression,
    //     regExp: /\.(js|css)$/,
    //     minRatio: 0,
    //     asset: "[path]"
    // })
  ]))
};

function skipFalsy(array) {
  return array.filter(function(item) { return !!item })
}

deps.forEach(function (dep) {
  var depPath = path.resolve(node_modules_dir, dep);
  var alias = dep.split(path.sep)[0];
  config.resolve.alias[alias] = depPath;
  config.module.noParse.push(depPath);
});

module.exports = config;
