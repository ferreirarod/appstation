const path = require("path");
const webpack = require("webpack");
module.exports = {
  entry: {
    app: ["./app/app-station.ts"]//,
    //vendor: ["jquery", "firebase", "gridstack.jQueryUI"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    libraryTarget: 'var',
    library: 'appstation'
  },
  externals: {
    "firebase": "firebase",
    "jquery": "$",
    "gridstack.jQueryUI": true
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
  // plugins: [
  //   new webpack.optimize.CommonsChunkPlugin({
  //     name: "vendor",

  //     // filename: "vendor.js"
  //     // (Give the chunk a different name)

  //     minChunks: Infinity,
  //     // (with more entries, this ensures that no other module
  //     //  goes into the vendor chunk)
  //   })
  // ],
  //devtool: 'inline-source-map'
};