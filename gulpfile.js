var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    wrap = require('gulp-wrap'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    minifyCss = require('gulp-cssnano'),
    minifyJs = require('gulp-uglify'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyHTML = require('gulp-htmlmin'),
    order = require("gulp-order"),
    print = require('gulp-print');

var paths = {
    scripts: 'front_src/js/**/*.*',
    styles: 'front_src/less/**/*.*',
    images: 'front_src/img/**/*.*',
    templates: 'front_src/templates/**/*.html',
    index: 'front_src/index.html',
    bower_fonts: 'front_src/components/**/*.{ttf,woff,woff2,eof,svg,otf,eot}',
};

/**
 * Handle bower components from index
 */
gulp.task('usemin', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: [minifyJs(), 'concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat'],
        }))
        .pipe(gulp.dest('public/'));
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts']);

gulp.task('copy-bower_fonts', function() {
    return gulp.src(paths.bower_fonts)
        .pipe(rename({
            dirname: '/fonts'
        }))
        .pipe(gulp.dest('public/lib'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less', 'custom-templates']);

gulp.task('custom-images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('public/img'));
});

gulp.task('custom-js', function() {
    return gulp.src(paths.scripts)
        .pipe(order([
            "front_src/js/app.js",
            "front_src/js/routes.js",
            "front_src/js/*.js",
            "front_src/js/controller/*.js",
            "front_src/js/factories/*.js",
            "front_src/js/filters/*.js",
            "front_src/js/directives/*.js",
        ], { base: './' }))
        //.pipe(minifyJs())
        .pipe(concat('dashboard.min.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('custom-less', function() {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('public/css'));
});

gulp.task('custom-templates', function() {
    return gulp.src(paths.templates)
        .pipe(minifyHTML())
        .pipe(gulp.dest('public/templates'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function() {
    gulp.watch([paths.images], ['custom-images']);
    gulp.watch([paths.styles], ['custom-less']);
    gulp.watch([paths.scripts], ['custom-js']);
    gulp.watch([paths.templates], ['custom-templates']);
    gulp.watch([paths.index], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function() {
    connect.server({
        root: 'public',
        livereload: true,
        port: 8888
    });
});

gulp.task('livereload', function() {
    gulp.src(['public/**/*.*'])
        .pipe(watch(['public/**/*.*']))
        .pipe(connect.reload());
});

/**
 * Gulp tasks
 */
gulp.task('build', ['usemin', 'build-assets', 'build-custom']);
gulp.task('default', ['build', 'webserver', 'livereload', 'watch']);


// debug tasks

gulp.task('build-custom-dev', ['custom-images', 'custom-js-debug', 'custom-less', 'custom-templates']); 
gulp.task('build-dev', ['usemin-debug', 'build-assets', 'build-custom-dev']);
gulp.task('debug', ['build-dev', 'webserver', 'livereload', 'watch-dev']);

gulp.task('usemin-debug', function() {
    return gulp.src(paths.index)
        .pipe(usemin({
            js: ['concat'],
            css: [minifyCss({keepSpecialComments: 0}), 'concat'],
        }))
        .pipe(gulp.dest('public/'));
});

gulp.task('custom-js-debug', function() {
    return gulp.src(paths.scripts)
        .pipe(order([
            "front_src/js/app.js",
            "front_src/js/routes.js",
            "front_src/js/*.js",
            "front_src/js/factories/*.js",
            "front_src/js/filters/*.js",
            "front_src/js/directives/*.js",
            "front_src/js/controller/*.js",
        ], { base: './' }))
        .pipe(print())
        .pipe(concat('dashboard.min.js'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('watch-dev', function() {
    gulp.watch([paths.images], ['custom-images']);
    gulp.watch([paths.styles], ['custom-less']);
    gulp.watch([paths.scripts], ['custom-js-debug']);
    gulp.watch([paths.templates], ['custom-templates']);
    gulp.watch([paths.index], ['usemin-debug']);
});