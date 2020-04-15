const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const buildVersion = function() {
  return require("../package.json").version;
};
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",
  entry: {
    editor: "./src/editor.js"
  },
  output: {
    publicPath: "/"
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(`${buildVersion()} DEV`),
      "process.env.APP_ENV": JSON.stringify("development")
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
    publicPath: "/",
    host: "0.0.0.0",
    historyApiFallback: {
      rewrites: [{ from: /^\/editor\//, to: "/editor.html" }]
    },
    port: 9000,
    after: (/*app*/) => {
      //app.post("/path", (req, res) => {
      //res.send(JSON.stringify({ message: "POST request to path" }));
      //});
    }
  }
});
