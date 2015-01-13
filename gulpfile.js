var 
    // Dependencies
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-rimraf'),  
    connect = require('gulp-connect'),  
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    run = require("gulp-run"),
    
    // Directories
    dist = './dist/',
    dev = './dev/',
    node = './node/',
    python = './python/',
    
    // Server
    server = {
      host: '127.0.0.1',
      port: 1337
    };

gulp.task('default', ['veni', 'vidi', 'vici']);
    
gulp.task('veni', function () {
  
  // Copy the dev
  gulp.src([dev + '**/*.*', '!' + dev + '**/*.scss'])
      .pipe(plumber())
      .pipe(gulp.dest(dist));
  
  // Copy AWS resources
  gulp.src([node + 'vpcData/*.json', node + 'vpcData/__files__'])
      .pipe(gulp.dest(dist + 'data/json/'));
  gulp.src(python + 'vpcData/*.html')
      .pipe(gulp.dest(dist + 'data/html/'));
  
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
    host: server.host,
    port: server.port,
    root: dist,
    livereload: true
  });
  
  run('open http://' + server.host + ':' + server.port ).exec();
  
});

gulp.task('vici', function () {
  
  gulp.src(dev + '**/*.*')
      .pipe(plumber())
      .pipe(connect.reload());
  
});