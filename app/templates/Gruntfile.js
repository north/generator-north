'use strict';

module.exports = function (grunt) {
  var options = require('./.compass-options').compassOptions();

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [options.js + '/{,**/}*.js']
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', ['jshint']);
}