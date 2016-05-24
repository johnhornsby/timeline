module.exports = {
	entry: "./src/index.js",
	output: {
		libraryTarget: "umd",
		path: __dirname + "/dist",
		filename: "timeline.js",
		library: "Timeline"
	},
	module: {
	  loaders: [
	    {
	      test: /\.js?$/,
	      exclude: /(dist|lib|node_modules)/,
	      loader: 'babel-loader?presets[]=es2015,presets[]=stage-0'
	    }
	  ]
	}
}
