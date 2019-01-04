const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const buildVersion = function() {
  return require("../package.json").version;
};
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  entry: {
    editor: "./src/editor.js"
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(`${buildVersion()} DEV`)
    }),
    new HtmlWebpackPlugin({
      template: "src/editor.html",
      filename: "editor.html",
      chunks: ["editor"]
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
