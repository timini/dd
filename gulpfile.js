var gulp = require('gulp');
var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');
var orm = require('orm');
var path = require('path');
var mocha = require('gulp-mocha');
var server = require('gulp-express');

var db = require('./backend/config/db');
var settings = require('./backend/config/settings');


var paths = {
  style: ['./frontend/style/*.styl'],
  jsApp: ['./frontend/js/app.js'],
  js: ['./frontend/js/**/*.js']
};

gulp.task('clean-js', function (cb) {
  del(['build/js'], cb);
});

gulp.task('clean-css', function (cb) {
  del(['build/css'], cb);
});

gulp.task('css', ['clean-css'], function () {
  return gulp.src(paths.style).pipe(stylus()).pipe(gulp.dest('./build/css'));
});

gulp.task('js', ['clean-js'], function () {
  browserify({ entries: paths.jsApp }).transform(reactify).bundle().pipe(source('bundle.js')).pipe(gulp.dest('./build/js/'));
});

gulp.task('syncdb', function () {
  orm.connect(settings.db, function (err, dbConn) {
    if (err)
      return console.log('DB connection error' + err);
    else {
      models = db.init(dbConn);
      dbConn.drop(function () {
        console.log('existing tables dropped');
        db.sync(models, function () {
          console.log('done');
        });
      });
    }
  });
});

gulp.task('runserver', ['watch'], function () {
  server.run({
    file: 'backend/app.js',
    env: 'development'
  });
  //restart the server when file changes
  gulp.watch(paths.style, server.notify);
  gulp.watch(paths.js, server.notify);
});

gulp.task('test', function () {
  gulp.src('test/*.js', { read: false }).pipe(mocha({ reporter: 'spec' }));
});

gulp.task('watch', function () {
  gulp.watch(paths.style, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', [
  'css',
  'js',
  'watch'
]);
