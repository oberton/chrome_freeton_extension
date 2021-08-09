const path                 = require('path');
const webpack              = require('webpack');
const TerserPlugin         = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // to generate css file
const CopyWebpackPlugin    = require('copy-webpack-plugin');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const sass                 = require("sass");

const NODE_ENV             = process.env.NODE_ENV || 'none';
const isProd               = NODE_ENV === 'production';

const yaml                 = require('js-yaml');

const packConf = {

  context: `${__dirname}/src`,

  node : {
    __filename : true,
    __dirname  : true,
  },

  mode: NODE_ENV,

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
      test: /\.svelte$/,
      loader: 'svelte-loader',
      options: {
        onwarn: () => true,
      },
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
          sourceMap : !isProd,
        },
      }, {
        loader: 'sass-loader',
        options: {
          implementation: sass,
          sourceMap: !isProd,
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
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),

  ],

  performance: {
    hints: false,
  },
};

if (isProd) {
  packConf.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  );

  packConf.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: 'all',
        parallel: true,
      }),
    ],
  };
} else {
  packConf.devtool = 'source-map';
}

const popupConf = {
  ...packConf,
  entry: {
    popup: './js/popup',
  },
};

const backgroundConf = {
  ...packConf,
  entry: {
    background: './js/background/index',
  },
};

const contentScriptConf = {
  ...packConf,
  entry: {
    'content-script': 'js/content-script',
  },
};

popupConf.resolve = {
  ...packConf.resolve,
  fallback: {
    crypto: require.resolve("crypto-browserify"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
  },
};

popupConf.plugins = [
  ...packConf.plugins,

  new MiniCssExtractPlugin({
    filename: 'stylesheets/main.css',
  }),

  new webpack.ProvidePlugin({
    _: 'lodash',
    tonMethods: ['js/ton/methods.js', 'default'],
    to: ['js/utils/to.js', 'default'],
    conf: ['conf.js', 'default'],
    svelte: ['svelte'],
    utils: ['js/utils/index.js', 'default'],
    t: ['js/translate.js', 't'],
    Buffer: ['buffer', 'Buffer'],
  }),

  new HtmlWebpackPlugin({
    filename: './html/popup.html',
    template: './html/popup.html',
    inject: false,
  }),

  new CopyWebpackPlugin({
    patterns: [{
      from: 'locales/**/*',
      to: 'locales/[name].json',
      transform: (content) => Buffer.from(JSON.stringify(yaml.load(content.toString('utf8'), { schema: yaml.JSON_SCHEMA })), 'utf8'),
    }, {
      from: './sig-files', to: 'sig-files',
    }, {
      from: '../node_modules/@tonclient/lib-web/tonclient.wasm', to: 'tonclient.wasm',
    }, {
      from: './manifest.json', to: 'manifest.json',
    }, {
      from: './fonts', to: './fonts',
    }, {
      from: './images', to: 'images',
    }],
  }),

  new webpack.PrefetchPlugin(path.join('stylesheets/main.scss')),
];

backgroundConf.plugins = [
  ...packConf.plugins,

  new webpack.ProvidePlugin({
    _: 'lodash',
    to: ['js/utils/to.js', 'default'],
    conf: ['conf.js', 'default'],
  }),

  new HtmlWebpackPlugin({
    filename: './html/background.html',
    template: './html/background.html',
    inject: false,
  }),
];

module.exports = [popupConf, backgroundConf, contentScriptConf];
