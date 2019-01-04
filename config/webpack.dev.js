const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const buildVersion = function() {
  return require("../package.json").version;
};

module.exports = merge(common, {
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(`${buildVersion()} DEV`)
    })
  ],
  devtool: "inline-source-map",
  devServer: {
    contentBase: "../dist",
    hot: true,
    host: "0.0.0.0",
    port: 9000
  }
});
