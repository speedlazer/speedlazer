const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const uglifyConfig = require("./uglify");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const buildVersion = function() {
  return require("../package.json").version;
};

const babel = require("./babel");
babel.presets.push("babel-preset-minify");

module.exports = merge(common, {
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.VERSION": JSON.stringify(buildVersion()),
      "process.env.GA_TRACKER": JSON.stringify("UA-71899181-1")
    }),
    new UglifyJSPlugin(uglifyConfig)
  ]
});
