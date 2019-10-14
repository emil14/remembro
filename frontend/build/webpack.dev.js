const path = require("path");
const webpackMerge = require("webpack-merge");
const commonWebpackConfig = require("./webpack.common");

module.exports = webpackMerge(commonWebpackConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "../dist"),
    open: true
  }
});
