/* jshint node: true */

'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.loadNpmTasks('grunt-jscs');

  grunt.initConfig({
    githooks: {
      all: {
        'pre-commit': 'jscs jshint'
      }
    },
    'http-server': {
      dev: {
        root: __dirname
      }
    },
    jscs: {
      main: ['*.js']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      files: {
        src: ['*.js']
      }
    }
  });

  grunt.registerTask('default', ['jscs', 'jshint']);
};
