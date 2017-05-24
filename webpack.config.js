const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");
module.exports = {
  entry: {
    app: ["./app/main.ts"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/assets/",
    filename: "bundle.js"
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
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
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
  devtool: 'inline-source-map',
  plugins: [
    new ExtractTextPlugin("styles.css"),
  ]
};