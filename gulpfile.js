var gulp    = require('gulp'),
    babel   = require('gulp-babel'),
    nodemon = require('gulp-nodemon'),
    del     = require('del');

var lib        = './lib/',
    es6glob    = lib + '**/*.es6',
    jsglob     = lib + '**/*.js',
    ignoreglob = '!./node_modules/**',
    changedEs6Files;

gulp.task('clean-es5', function(done) {
  del([jsglob])
    .then(function () { done(); });
});

gulp.task('clean-es6', function(done) {
  del([es6glob])
    .then(function () { done(); });
});

gulp.task('transpile', function () {
  return gulp.src(changedEs6Files)
    .pipe(babel({presets: ['es2015', 'stage-1']}))
    .pipe(gulp.dest(lib));
});

gulp.task('default', ['transpile'], function (done) {
  nodemon({
    script : 'app.js',
    ext    : 'es6',
    watch  : lib,
    tasks: function (changedFiles) {
      changedFiles.forEach();
      
    }});
});
