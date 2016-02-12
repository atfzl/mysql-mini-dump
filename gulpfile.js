var gulp    = require('gulp'),
    babel   = require('gulp-babel'),
    watch   = require('gulp-watch'),
    nodemon = require('gulp-nodemon'),
    plumber = require('gulp-plumber'),
    del     = require('del'),
    _       = require('lodash'),
    path    = require('path');

var lib          = 'lib',
    libPath      = path.resolve(lib),
    es6glob      = libPath   + '/**/*.es6',
    build        = 'build',
    buildPath    = path.resolve(build),
    jsglob       = buildPath + '/**/*.js',

    es6Extension = 'es6',
    jsExtension  = 'js',
    
    babelPresets = ['es2015', 'stage-2'],
    entryFile    = 'app.js';

gulp.task('default', ['transpile-watch']);
gulp.task('nodemon', ['transpile-watch', 'nodemon-watch']);

gulp.task('clean-build' , function(done) { return clean(buildPath , done); });

gulp.task('nodemon-watch', function (done) {
  setTimeout(function () {
    nodemon({script:entryFile, ext:jsExtension, watch:buildPath});
  }, 1000);
});

gulp.task('transpile-all', function () {
  return gulp.src(es6glob)
    .pipe(plumber())
    .pipe(babel({presets: babelPresets}))
    .pipe(gulp.dest(buildPath));
});

gulp.task('transpile-watch', function () {
  return gulp.src(es6glob)
    .pipe(plumber())
    .pipe(watch(es6glob)
          .on('change', function (path) {
            console.log('changed: '.blue + path.magenta);
          })
          .on('add'   , function (path) {
            console.log('added: '.blue + path.magenta);
          })
          .on('unlink', function (path) {
            console.log('removed: '.blue + path.magenta);
            del(path.replace(lib, build).replace(es6Extension, jsExtension));
          })
         )
    .pipe(babel({presets: babelPresets}))
    .pipe(gulp.dest(buildPath));
});

function clean (files, done) {
  del(files)
    .then(function () { done(); });
}
