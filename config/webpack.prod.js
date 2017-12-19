const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(common, {
  devtool: "source-map",
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.GA_TRACKER": JSON.stringify("UA-71899181-1")
    })
  ]
});
