'use strict';

module.exports = function (grunt) {
  var paths = require('compass-options').paths();
  <% if (server) { %>var dirs = require('compass-options').dirs();<% } %>

  grunt.initConfig({
    //////////////////////////////
    // JS Hint Options
    //////////////////////////////
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        paths.js + '/{,**/}*.js',
        '!' + paths.js + '/{,**/}*.min.js'
      ]
    }<% if (server) { %>,
    //////////////////////////////
    // Compass Options
    //////////////////////////////
    compass: {
      dist: {
        options: {
          bundleExec: true,
          config: './config.rb'
        }
      }
    },
    //////////////////////////////
    // Watch Options
    //////////////////////////////
    watch: {
      scripts: {
        files: paths.js + '/{,**/}*.js',
        tasks: ['jshint']
      },
      sass: {
        files: paths.sass + '/{,**/}*.{scss|sass}',
        tasks: ['compass']
      }
    },
    //////////////////////////////
    // BrowserSync Options
    //////////////////////////////
    browserSync: {
      dev: {
        bsFiles: {
          src: [
            paths.css +  '/**/*.css',
            paths.js + '/**/*.js',
            paths.img + '/**/*',
            paths.fonts + '/**/*',
            paths.html + '/**/*.html',
          ]
        },
        options: {
          watchTask: true,
          server: {
            baseDir: paths.html
          }
        }
      }
    }
    <% } %>
  });

  //////////////////////////////
  // Load all Grunt tasks
  //////////////////////////////
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  //////////////////////////////
  // Lint Task
  //////////////////////////////
  grunt.registerTask('lint', ['jshint']);
  <% if (server) { %>
  //////////////////////////////
  // Server Tasks
  //////////////////////////////
  grunt.registerTask('server', ['browserSync', 'watch']);
  grunt.registerTask('serve', ['server']);<% } %>
}