const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map', // 'eval-cheap-module-source-map'
  watch: true,
  mode: 'development'
});