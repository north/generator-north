'use strict';

//////////////////////////////
// Requires
//////////////////////////////
var paths = require('compass-options').paths(),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

//////////////////////////////
// Internal Vars
//////////////////////////////
var workPaths = [
  paths.html + '/**/*.html',
  '!node_modules/**/*.html',
  '!bower_components/**/*.html'
];

module.exports = function (gulp, devPaths) {
  gulp.task('dev-html', function () {
    devPaths = devPaths || workPaths;

    return gulp.src(devPaths)
      .pipe(reload({stream: true}));
  });
}
