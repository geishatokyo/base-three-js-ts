/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./base");
module.exports = merge(base, {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|glb|ogg|mp3)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.glsl/i,
        type: 'asset/source'
      }
    ],
  },
  devServer: {
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Playable",
      filename: "index.html",
      template: path.join(process.cwd(), "src", "index.ejs"),
    }),
  ],
});
