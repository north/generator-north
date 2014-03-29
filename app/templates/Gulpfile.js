var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var options = require('./.compass-options').compassOptions();

//////////////////////////////
// Begin Gulp Tasks
//////////////////////////////
gulp.task('lint', function () {
  gulp.src(options.js + '/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});
