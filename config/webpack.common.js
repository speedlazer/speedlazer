const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const babel = require("./babel");
const buildVersion = function() {
  return require("../package.json").version;
};

const cleanOptions = {
  root: path.resolve(__dirname, '..')
}

module.exports = {
  entry: {
    game: './app/index.js'
  },
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '..', 'dist')
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, '..', 'app/')
    },
    extensions: [".js", ".coffee"]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], cleanOptions),
    new HtmlWebpackPlugin({
      template: "app/index.html"
    }),
    new webpack.ProvidePlugin({
      Crafty: ['src/crafty-loader', 'default'],
      Game: ['src/scripts/Game', 'default'],
      $: ['jquery'],
      WhenJS: ['src/when-loader', 'default'],
      _: ['underscore']
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
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/'
          }
        }]
      },
      {
        test: /\.(ogg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/'
          }
        }]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minimize: true
        }
      },
      {
        test: /\.coffee$/,
        use: [
          'coffee-loader'
        ]
      }
    ]
  }
};
