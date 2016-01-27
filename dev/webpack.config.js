var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		app:["./src/main.js"]
	},
	output: {
		path: __dirname + "/js",
		filename: "app.js"
	},
	node: { fs: "empty" },
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: /(css|node_modules|scss)/,
				loader: 'babel-loader?stage=0'
			},
			{
				test: /node_modules\/unidragger/,
				loader: 'imports?define=>undefined'
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			}
		]
	}
}