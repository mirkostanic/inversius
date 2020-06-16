var gulp = require('gulp'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify-es').default,
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat');

var jsSources = ['js/modernizr-custom.js', 'js/main.js', 'js/form.js'],
    cssSources = ['css/*.css'],
    htmlSources = ['*.html'];

gulp.task('html', function() {
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('inversius.js'))
        .pipe(uglify())
        .pipe(gulp.dest(''))
        .pipe(connect.reload())
});

gulp.task('css', function() {
    gulp.src(cssSources)
        //.pipe(cssnano())
        .pipe(concat('inversius.css'))
        //.pipe(cssnano())
        .pipe(gulp.dest(''))
        .pipe(connect.reload())
});

gulp.task('connect', function() {
    connect.server({
        root: '.',
        livereload: true
    })
});

gulp.task('watch', function() {
    gulp.watch(jsSources, ['js']);
    gulp.watch(cssSources, ['css']);
    gulp.watch(htmlSources, ['html']);
});

gulp.task('default', gulp.parallel('html', 'js', 'css', 'connect', 'watch', function() {
    // default task code here
}));