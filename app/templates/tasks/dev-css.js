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
  paths.css + '/**/*.css'
];

module.exports = function (gulp, devPaths) {
  gulp.task('dev-css', function () {
    devPaths = devPaths || workPaths;

    return gulp.src(devPaths)
      .pipe(reload({stream: true}));
  });
}
