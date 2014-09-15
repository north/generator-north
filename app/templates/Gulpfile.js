'use strict';

var gulp = require('gulp');
var paths = require('compass-options').paths();<% if (server) { %>
var browserSync = require('browser-sync');
var shell = require('gulp-shell');<% } %>

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////
require('./tasks/jslint')(gulp);
<% if (server) { %>
//////////////////////////////
// Compass Task
//////////////////////////////
gulp.task('compass', function () {
  return gulp.src(paths.sass + '/**/*')
    .pipe(shell([
      'bundle exec compass watch --time'
    ]));
});

//////////////////////////////
// Watch
//////////////////////////////
gulp.task('watch', function () {
  gulp.watch(paths.js + '/**/*.js', ['jslint']);
});

//////////////////////////////
// BrowserSync Task
//////////////////////////////
gulp.task('browserSync', function () {
  browserSync.init([
    paths.css +  '/**/*.css',
    paths.js + '/**/*.js',
    paths.img + '/**/*',
    paths.fonts + '/**/*',
    paths.html + '/**/*.html',
  ], {
    server: {
      baseDir: paths.html
    }
  });
});

//////////////////////////////
// Server Tasks
//////////////////////////////
gulp.task('server', ['watch', 'compass', 'browserSync']);
gulp.task('serve', ['server']);
<% } %>
