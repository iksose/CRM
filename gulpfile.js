var gulp = require('gulp');
var traceur = require('gulp-traceur');
var traceurOptions = require('./config').traceur;
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var gutil = require('gutil');
var livereload = require('gulp-livereload');


var path = {
    src: './src/**/*.js'
};


// TRANSPILE ES6
gulp.task('build', function() {
    gulp.src(path.src)
        .pipe(sourcemaps.init())
        .pipe(traceur(traceurOptions))
        .on('error', gutil.log)
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/src'));
});

// WATCH LIBS
gulp.task('vendor', function() {
    gulp.src('./libs/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/src'))
    // .pipe(filesize())
    // .pipe(uglify())
    // .pipe(rename('vendor.min.js'))
    // .pipe(gulp.dest('compiled/src'))
    // .pipe(filesize())
    .on('error', gutil.log)
});


// WATCH FILES FOR CHANGES
gulp.task('watch', function() {
    var server = livereload();
    gulp.watch(path.src, ['build']);
    gulp.watch('./libs/*.js', ['vendor']);
    gulp.watch('compiled/src/**').on('change', function(file) {
        console.log("Gotcha")
        server.changed(file.path)
        // connect.reload(file)
    })
});


// WEB SERVER
gulp.task('serve', connect.server({
    root: [__dirname],
    port: 7000,
    open: true,
    livereload: false
}));
