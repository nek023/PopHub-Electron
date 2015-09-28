var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var browserSync = require("browser-sync").create();
var del = require('del');
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css')
var runSequence = require('run-sequence');
var sass = require('gulp-ruby-sass');

gulp.task('clean', function(callback) {
  del([
    'build',
  ], callback);
});

gulp.task('sass', function() {
  return sass('./src/renderer/assets/scss/*.scss')
    .on('error', function(error) {
      console.error('Error:', error.message);
    })
    .pipe(gulp.dest('./build/renderer/assets/css'));
});

gulp.task('autoprefixer', function() {
  return gulp.src('./build/renderer/assets/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./build/renderer/assets/css'));
});

gulp.task('minify-css', function() {
  return gulp.src('./build/renderer/assets/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/renderer/assets/css'));
});

gulp.task('copy', function() {
  return gulp.src(
    [
      './src/main/assets/**/*',
      './src/vendor/**/*',
      './src/**/*.html'
    ],
    { base: 'src' }
  )
  .pipe(gulp.dest('build'));
});

gulp.task('babelify', function() {
  return gulp.src(
    [
      './src/main/**/*.js',
      './src/renderer/**/*.js',
      './src/lib/**/*.js'
    ],
    { base: 'src' }
  )
  .pipe(babel({
    optional: ['runtime']
  }))
  .on('error', function(error) {
    console.error('Error:', error.message);
    this.emit('end');
  })
  .pipe(gulp.dest('build'));
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
});

gulp.task('build', function(callback) {
  runSequence(
    'lint',
    'sass',
    'autoprefixer',
    'minify-css',
    ['copy', 'babelify'],
    callback
  );
});

gulp.task('watch', ['build'], function() {
  gulp.watch([
    './src/**/*.js',
    './src/**/*.scss',
    './src/**/*.html'
  ], ['build']);
});

gulp.task('sync', ['build', 'browser-sync'], function() {
  gulp.watch(watch_paths, function() {
    runSequence('build', browserSync.reload);
  });
});

gulp.task('default', ['build']);
