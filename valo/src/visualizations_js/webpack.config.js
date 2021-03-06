"use strict";
/**
 * Webpack config file
 * https://webpack.js.org/
 * @license MIT
 * @author Andres Ramirez <aramirez@itrsgroup.com>
 * @author Zuri Pabón <zpabon@itrsgroup.com>
 * @author (Each contributor append a line here)
 */

const path = require('path');

const config = {
  entry: ['babel-polyfill', path.resolve(__dirname, 'src')],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    ignored: /node_modules/
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 8081,
  },
};

module.exports = config;
