var gulp        = require('gulp');

var browserify  = require('browserify');
var del         = require('del');
var reactify    = require('reactify');
var source      = require('vinyl-source-stream');
var stylus      = require('gulp-stylus');
var orm         = require('orm');
var path        = require('path');

// naughty global for making non-relative imports
BASE = function(p) { return path.join(__dirname, p); };

var db          = require('./src/config/db')
var settings    = require('./src/config/settings');

var paths = {
    style: ['./src/style/*.styl'],
    js_app: ['./src/js/app.js'],
    js: ['./src/js/**/*.js'],
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
    browserify({entries: paths.js_app})
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('syncdb', function(){
    var db_conn = orm.connect(settings.db, function(err){
        if (err) return console.log('DB connection error' + err);
        else{
            models = db.init(db_conn);
            db.sync(models);
        }
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.style, ['css']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['css', 'js', 'watch']);
