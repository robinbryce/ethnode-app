const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const PropertiesReader = require('properties-reader');
const appProperties = PropertiesReader('./src/assets/app.properties')._properties;
const modeConfig = env => require(`./tools/webpack.${env.mode}.js`)(env);
const loadPresets = require('./tools/loadPresets');

const webcomponentsjs = './node_modules/@webcomponents/webcomponentsjs';

const polyfills = {
  patterns: [
  {
    from: resolve(`${webcomponentsjs}/webcomponents-*.{js,map}`),
    to: 'vendor'//,
  },
  {
    from: resolve(`${webcomponentsjs}/bundles/*.{js,map}`),
    to: 'vendor/bundles'//,
  },
  {
    from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
    to: 'vendor',
  }
]};

const assets = {
  patterns:[
    {
      from: 'src/assets',
      to: 'assets/'
    },
    {
      from: 'src/*.html',
      to: ''
    },
    {
      from: 'src/img',
      to: 'img/'
    },
    {
      // from: resolve(`${webcomponentsjs}/*.js`),
      from: resolve(`${webcomponentsjs}/custom-elements-es5-adapter.js`),
      to: 'vendor'
    },
    {
      // from: resolve(`${webcomponentsjs}/*.js`),
      from: resolve(`${webcomponentsjs}/webcomponents-loader.js`),
      to: 'vendor'
    }

  ]
};

const plugins = [
  new CleanWebpackPlugin(),
  new webpack.ProgressPlugin(),
  new HtmlWebpackPlugin({
    chunks: ['index'],
    filename: 'index.html',
    template: './src/index.html',
    minify: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }
  }),
  new CopyWebpackPlugin({...polyfills, ...assets}, {
    ignore: ['.DS_Store']
  })
];

module.exports = ({ mode, presets }) => {
  return merge({
    entry: {
      index: './src/index.js'
    },
    externals: {
         'appProperties': JSON.stringify(appProperties)
    },
    mode,
    output: {
      path: resolve(__dirname, "./dist/"),
      // filename: '[name].[chunkhash:8].js',
      filename: '[name].js',
      publicPath: '/console/',
    },
    devtool: "source-map",
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
          plugins: ['@babel/plugin-syntax-dynamic-import'],
          presets: [[
            '@babel/preset-env',
              {
                 useBuiltIns: 'usage',
                 corejs: "3.21.0",
                 targets: '>1%, not dead, not ie 11'
              }
          ]]
        }
      }]
      },
      plugins
    },
    modeConfig({ mode, presets }),
    loadPresets({ mode, presets })
  ); //webpackMerge
};
