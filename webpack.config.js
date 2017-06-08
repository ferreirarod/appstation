const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require("path");

module.exports = {
  entry: {
    app: "./app/app-station.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[chunkhash].js",
    library: "appstation",
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    firebase: 'firebase'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.useable\.css$/,
        use: [
          {
            loader: "style-loader/useable"
          },
          { loader: "css-loader" },
        ],
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "jquery-ui": "jquery-ui/ui",
      "gridstack.jQueryUI": "gridstack/dist/gridstack.jQueryUI"
    }
  },
  plugins: [
    new UglifyJSPlugin({
      comments: false, 
      sourceMap: true
    })
  ]
};