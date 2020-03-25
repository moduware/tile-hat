const gulp = require('gulp');
const zip = require('gulp-zip');

exports.default = () => (
  gulp.src(['build/nexpaq.tile.hat/**'])
      .pipe(zip('tile.zip'))
      .pipe(gulp.dest('./'))
);