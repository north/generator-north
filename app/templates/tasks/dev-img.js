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
  paths.img + '/**/*'
];

module.exports = function (gulp, devPaths) {
  gulp.task('dev-img', function () {
    devPaths = devPaths || workPaths;

    return gulp.src(devPaths)
      .pipe(reload({stream: true}));
  });
}
