const webpackMerge = require("webpack-merge");
const commonWebpackConfig = require("./webpack.common");

module.exports = webpackMerge(commonWebpackConfig, {
  mode: "production"
});
