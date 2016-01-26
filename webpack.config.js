module.exports = {
	entry: "./src/timeline.js",
	output: {
		libraryTarget: "umd",
		path: __dirname + "/dist",
		filename: "timeline.js"
	},
	module: {
	  loaders: [
	    {
	      test: /\.js?$/,
	      exclude: /(dist|lib|node_modules)/,
	      loader: 'babel-loader'
	    }
	  ]
	}
}