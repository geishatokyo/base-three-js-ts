/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const { merge } = require("webpack-merge");
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const base = require("./base");

const isIronSource = process.env.PLATFORM === "ironsource";
const isToutiao = process.env.PLATFORM === "toutiao";
const isGoogle = process.env.PLATFORM === "google";

const platform = process.env.PLATFORM || "test";

module.exports = merge(base, {
  mode: "production",
  entry: path.join(process.cwd(), "src", "entry", platform + ".js"),
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|glb|ogg|mp3)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.glsl/i,
        type: 'asset/source'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Playable",
      filename: "index.html",
      template: path.join(process.cwd(), "src", "index.ejs"),
      minify: { collapseWhitespace: true },
      isIronSource,
      isToutiao,
      isGoogle,
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.(js|css)$/, /main.css/]),
  ],
});
