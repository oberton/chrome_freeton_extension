const path                 = require('path');
const webpack              = require('webpack');
const TerserPlugin         = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // to generate css file
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const HtmlWebpackPlugin    = require('html-webpack-plugin');

const NODE_ENV             = process.env.NODE_ENV || 'none';

module.exports = {

  context: `${__dirname}/src`,

  node : {
    __filename : true,
    __dirname  : true,
  },

  mode: NODE_ENV,

  entry: {
    popup: './js/popup',
  },

  output: {
    path       : `${__dirname}/dist`,
    publicPath : '/',
    filename   : 'js/[name].js',
  },

  module: {
    rules : [{
      test    : /\.js$/,
      loader  : 'babel-loader',
      exclude : /node_modules/,
    }, {
      test   : /\.(png|jpg|gif|svg|ttf|woff|woff2|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader : 'file-loader',
      options: {
        name: `[name].[ext]`,
      },
    }, {
      test: /\.[s]*css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../',
        },
      }, {
        loader: 'css-loader',
        options : {
          url : false,
          sourceMap : NODE_ENV !== 'production',
        },
      }, {
        loader: 'sass-loader',
        options: {
          sourceMap: NODE_ENV !== "production",
          sassOptions : {
            sourceComments : true,
          },
        },
      }],
    }],
  },

  resolve: {
    modules: ['node_modules', 'src'],
    extensions: ['*', '.js'],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
    },
  },

  devServer: {
    historyApiFallback: {
      disableDotRule: true,
      rewrites: [{
        from: /^\/$/,
        to: '/html/popup.html',
      }],
    },
    disableHostCheck: true,
    contentBase: path.join(__dirname, '/dist'),
    hot: false,
    inline: false,
  },

  plugins: [

    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
    }),

    new MiniCssExtractPlugin({
      filename: 'stylesheets/main.css',
    }),

    new webpack.ProvidePlugin({
      _: 'lodash',
      tonClient: ['js/ton/client.js', 'default'],
      tonMethods: ['js/ton/methods.js', 'default'],
      conf: ['conf.js', 'default'],
    }),

    new HtmlWebpackPlugin({
      filename: './html/popup.html',
      template: './html/popup.html',
      inject: false,
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: './sig-files', to: 'sig-files' },
        { from: '../node_modules/@tonclient/lib-web/tonclient.wasm', to: 'tonclient.wasm' },
        { from: './manifest.json', to: 'manifest.json'},
        { from: './images', to: 'images' },
      ],
    }),

    new webpack.PrefetchPlugin(path.join('stylesheets/main.scss')),
  ],

  performance: {
    hints: false,
  },
};

if (NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  );

  module.exports.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
        parallel: true,
      }),
    ],
  };
// } else {
  // module.devtool = 'source-map';
}
