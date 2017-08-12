const NODE_ENV = process.env.NODE_ENV || 'development';

let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');
let WebpackBuildNotifierPlugin = require('webpack-build-notifier');

module.exports = {
  context: __dirname + '/src',

  entry: {
    main: ['webpack-dev-server/client?http://localhost:8080/','./main.js']
  },

  output: {
    path: __dirname + '/dist',
    publicPath: 'dist',
    filename: 'app.js'
  },

  watch: NODE_ENV === 'development',

  watchOptions: {
    aggregateTimeout: 200
  },

  devtool: NODE_ENV === 'development' ? 'eval' : 'source-map',

  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV'),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBuildNotifierPlugin({
      title: "Game",
      logo: path.resolve("./img/favicon.png"),
      suppressSuccess: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },

      {
         test: /\.html$/,
         loader: "raw-loader"
      },

      {
        test: /\.styl$/,
        use: [ 'style-loader', 'css-loader', 'stylus-loader' ],
      },

      {
        "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
        // "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
        use: [ 'url-loader' ],
      },
    ]
  }, 

  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    inline: true,
    // contentBase: path.join(__dirname, "dist"),
    watchOptions: {
      poll: true
    }
  }
}

if (NODE_ENV === 'production') {
  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin())
}
