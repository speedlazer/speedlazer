const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const uglifyConfig = require("./uglify");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const buildVersion = function() {
  return require("../package.json").version;
};

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.VERSION": JSON.stringify(buildVersion())
    }),
    new UglifyJSPlugin(uglifyConfig)
  ]
});
