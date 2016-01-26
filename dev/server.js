var webpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.config.js");
config.entry.app.unshift("webpack-dev-server/client?http://localhost:3000");
var compiler = webpack(config);
var server = new webpackDevServer(compiler, {});
server.listen(3000);