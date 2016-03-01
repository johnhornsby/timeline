webpackConfig = require("./webpack.config.js")
webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080");

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      styles: {
        files: ['./scss/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
          livereload: true
        },
      },

      scripts: {
        files: ['./src/**/*.js'],
        tasks: ['webpack'],
        options: {
          spawn: false,
          livereload: true
        },
      }
    },

    babel: {
      options: {
        sourceMap: false,
        stage: 0
      },
      dist: {
        files: {
          '../lib/timeline.js': '../src/timeline.js'
        }
      }
    },

    concurrent: {
        target: {
            tasks: ['watch', 'webpack-dev-server:start'],
            options: {
                logConcurrentOutput: true
            }
        }
    },

    exec: {
      webpack: {
        cmd: 'webpack',
        cwd: '../'
      }
    },

    sass: {
        options: {
            sourceMap: false
        },
        dist: {
            files: {
                './css/app.css': './scss/app.scss'
            }
        }
    },

    webpack: {
      dev: webpackConfig
    },

    "webpack-dev-server": {
      options: {
        webpack: webpackConfig,
      },
      start: {
        keepAlive: true,
        webpack: {
          devtool: "eval",
          debug: true
        }
      }
    },

  });



  grunt.registerTask('build', ['sass', 'webpack']);
  grunt.registerTask('develop', ['concurrent:target']);

  grunt.registerTask('default', ['build', 'develop']);

};
