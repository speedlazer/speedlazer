const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const babel = require("./babel");
const buildVersion = function() {
  return require("../package.json").version;
};

const cleanOptions = {
  root: path.resolve(__dirname, "..")
};

module.exports = {
  entry: {
    game: "./src/index.js"
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "..", "dist"),
    publicPath: "./"
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "..", "src/")
    },
    extensions: [".js", ".coffee"]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], cleanOptions),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new webpack.ProvidePlugin({
      Crafty: ["src/crafty-loader", "default"],
      Game: ["src/Game", "default"],
      WhenJS: ["src/when-loader", "default"]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: babel
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/"
            }
          }
        ]
      },
      {
        test: /\.(ogg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/"
            }
          }
        ]
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          minimize: true
        }
      },
      {
        test: /\.coffee$/,
        use: ["coffee-loader"]
      }
    ]
  }
};
