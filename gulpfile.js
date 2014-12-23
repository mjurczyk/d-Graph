var gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-rimraf'),  
    connect = require('gulp-connect'),  
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber');

var dist = './dist/',
    dev = './dev/';

gulp.task('default', ['veni', 'vidi', 'vici']);
    
gulp.task('veni', function () {
  
  // Copy the dev
  gulp.src([dev + '**/*.*', '!' + dev + '**/*.scss'])
      .pipe(plumber())
      .pipe(gulp.dest(dist));
  
  // Build SCSS
  gulp.src(dev + 'data/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dist + 'data/css/'));
  
});

gulp.task('vidi', function () {
  
  gulp.watch(dev + '**/*.*',{base: dev} , ['veni', 'vici']);
  
  connect.server({
    port: 80,
    root: dist,
    livereload: true
  });
  
});

gulp.task('vici', function () {
  
  gulp.src(dev + '**/*.*')
      .pipe(plumber())
      .pipe(connect.reload());
  
});