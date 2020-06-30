const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const buildVersion = function() {
  return require("../package.json").version;
};

module.exports = merge(common, {
  mode: "production",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(`${buildVersion()}`),
      "process.env.APP_ENV": JSON.stringify("development")
    })
  ],
  devtool: "source-map",
  stats: "errors-only",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
});
