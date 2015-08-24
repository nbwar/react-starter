var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

var assetsPath = path.join(__dirname, "..", "public", "assets");
var publicPath = "assets/";

var production = process.env.NODE_ENV == 'production'

var plugins = [new ExtractTextPlugin("styles/main.css")]
var productionPlugins =  [new webpack.optimize.UglifyJsPlugin({minimize: true})]



var commonLoaders = [
  {
    /*
     * TC39 categorises proposals for babel in 4 stages
     * Read more http://babeljs.io/docs/usage/experimental/
     */
    test: /\.js$|\.jsx$/,
    loader: "babel-loader?stage=0",
    include: path.join(__dirname, "..",  "app")
  },
  { test: /\.ico$/, loader: "file-loader?name=[name].[ext]" },
  { test: /\.png$/, loader: "file-loader?name=[path][name].[ext]" },
  { test: /\.jpg$/, loader: "file-loader?name=[path][name].[ext]" },
  { test: /\.html$/, loader: "html-loader" },
  { test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style', 'css?module&localIdentName=[local]__[hash:base64:5]' +
      '&sourceMap!autoprefixer-loader!sass?sourceMap&outputStyle=expanded' +
      '&includePaths[]=' + (path.resolve(__dirname, '../node_modules')))
  }
];

module.exports = [
  {
    // The configuration for the client
    name: "browser",
    /* The entry point of the bundle
     * Entry points for multi page app could be more complex
     * A good example of entry points would be:
     * entry: {
     *   pageA: "./pageA",
     *   pageB: "./pageB",
     *   pageC: "./pageC",
     *   adminPageA: "./adminPageA",
     *   adminPageB: "./adminPageB",
     *   adminPageC: "./adminPageC"
     * }
     *
     * We can then proceed to optimize what are the common chunks
     * plugins: [
     *  new CommonsChunkPlugin("admin-commons.js", ["adminPageA", "adminPageB"]),
     *  new CommonsChunkPlugin("common.js", ["pageA", "pageB", "admin-commons.js"], 2),
     *  new CommonsChunkPlugin("c-commons.js", ["pageC", "adminPageC"]);
     * ]
     */
    context: path.join(__dirname, "..", "app"),
    entry: {
      app: "./client"
    },
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: "[name].bundle.js",
      // The output path from the view of the Javascript
      publicPath: publicPath

    },
    devtool: "source-map",
    module: {
      preLoaders: [{
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loaders: ["eslint"]
      }],
      loaders: commonLoaders
    },
    resolve: {
      extensions: ['', '.react.js', '.js', '.jsx', '.scss'],
      modulesDirectories: [
        "app", "node_modules"
      ]
    },
    plugins: production ? plugins.concat(productionPlugins) : plugins
  }, {
    // The configuration for the server-side rendering
    name: "server-side rendering",
    context: path.join(__dirname, "..", "app"),
    entry: {
      app: "./server",
      header: "./elements/Header"
    },
    target: "node",
    output: {
      // The output directory as absolute path
      path: assetsPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: "[name].server.js",
      // The output path from the view of the Javascript
      publicPath: publicPath,
      libraryTarget: "commonjs2"
    },
    externals: /^[a-z\-0-9]+$/,
    module: {
      loaders: commonLoaders
    },
    resolve: {
      extensions: ['', '.react.js', '.js', '.jsx', '.scss'],
      modulesDirectories: [
        "app", "node_modules"
      ]
    },
    plugins: production ? plugins.concat(productionPlugins) : plugins
  }
];
