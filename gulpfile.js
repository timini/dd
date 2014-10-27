var gulp = require('gulp');

var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');
var orm = require('orm');
var path = require('path');

var db = require('./backend/config/db')
var settings = require('./backend/config/settings');

var paths = {
  style: ['./frontend/style/*.styl'],
  jsApp: ['./frontend/js/app.js'],
  js: ['./frontend/js/**/*.js'],
};

gulp.task('clean-js', function(cb) {
  del(['build/js'], cb);
});

gulp.task('clean-css', function(cb) {
  del(['build/css'], cb);
});

gulp.task('css', ['clean-css'], function() {
  return gulp.src(paths.style)
    .pipe(stylus())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('js', ['clean-js'], function() {
  browserify({entries: paths.jsApp})
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('syncdb', function() {
  var dbConn = orm.connect(settings.db, function(err){
    if (err) return console.log('DB connection error' + err);
    else {
      models = db.init(dbConn);
      db.sync(models);
    }
  });
});

gulp.task('runserver', function(){
  // - should watch for changes and push them
  // - run the server
});

gulp.task('watch', function() {
  gulp.watch(paths.style, ['css']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);
