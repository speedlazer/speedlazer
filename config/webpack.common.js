const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const babel = require("./babel");
const cleanOptions = {
  root: path.resolve(__dirname, "..")
};

module.exports = {
  entry: {
    game: "./src/index.js"
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "..", "dist")
  },
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "..", "src/")
    },
    extensions: [".js"]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"], cleanOptions),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      excludeChunks: ["editor"]
    }),
    new webpack.ProvidePlugin({
      Crafty: ["src/crafty", "default"],
      Game: ["src/game", "default"]
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
        test: /\.s?css$/,
        use: [
          "style-loader",
          "css-loader?modules=true",
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(frag|vert)$/,
        use: ["raw-loader"]
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
        test: /\.(ogg|mp3)$/,
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
        test: /\.data$/,
        use: [
          {
            loader: "babel-loader",
            options: babel
          },
          {
            loader: path.resolve("config/loaders/data")
          }
        ]
      }
    ]
  }
};
