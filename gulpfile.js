var gulp = require('gulp');

var browserify = require('browserify');
var del = require('del');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var stylus = require('gulp-stylus');

var paths = {
    style: ['./src/style/*.styl'],
    jsx: ['./src/js/app.js'],
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
    browserify({entries: paths.jsx})
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/js/'));
});

gulp.task('watch', function() {
    gulp.watch(paths.style, ['css']);
    gulp.watch(paths.jsx, ['js']);
});

gulp.task('default', ['watch', 'css', 'js']);
