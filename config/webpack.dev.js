const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.GA_TRACKER': JSON.stringify('UA-Tracker')
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: '../dist',
    hot: true,
    port: 9000
  }
});
