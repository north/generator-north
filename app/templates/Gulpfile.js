'use strict';

var gulp = require('gulp')<% if (!server) { %>;<% } else { %>,
    paths = require('compass-options').paths(),
    browserSync = require('browser-sync'),
    shell = require('gulp-shell');<% }%>

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////
require('./tasks/jshint')(gulp);
<% if (server) { %>require('./tasks/dev-css')(gulp);
require('./tasks/dev-img')(gulp);
require('./tasks/dev-fonts')(gulp);
require('./tasks/dev-html')(gulp);
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
gulp.task('watch-js', function () {
  return gulp.watch(paths.js + '/**/*.js', ['jshint']);
});

gulp.task('watch-css', function () {
  return gulp.watch(paths.css + '/**/*.css', ['dev-css']);
});

gulp.task('watch-img', function () {
  return gulp.watch(paths.img + '/**/*', ['dev-img']);
});

gulp.task('watch-fonts', function () {
  return gulp.watch(paths.fonts + '/**/*', ['dev-fonts']);
});

gulp.task('watch-html', function () {
  return gulp.watch([
    paths.html + '/**/*.html',
    '!node_modules/**/*.html',
    '!bower_components/**/*.html'
  ], ['dev-html']);
});

gulp.task('watch', ['watch-js', 'watch-css', 'watch-img', 'watch-fonts', 'watch-html']);

//////////////////////////////
// BrowserSync Task
//////////////////////////////
gulp.task('browserSync', function () {
  return browserSync({
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
