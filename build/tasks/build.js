var gulp = require('gulp');
var runSequence = require('run-sequence');
var to5 = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var compilerOptions = require('../babel-options');
var assign = Object.assign || require('object.assign');
var rename = require('gulp-rename');
var merge = require('merge2');
var jsName = paths.packageName + '.js';
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

// copies src/index.ts to dist/<package-name>.ts
gulp.task('build-index', function() {
  return gulp.src(paths.root + 'index.ts')
    .pipe(rename(function (file) { file.basename = paths.packageName; }))
    .pipe(gulp.dest(paths.output));
});

// gulp-typescript compiles TS files into ES6
gulp.task('build-ts', function () {
  var tsResult = gulp.src([paths.tsSource, paths.typings, paths.jspmDefinitions])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));
  return merge([
    tsResult.js
      .pipe(sourcemaps.write({includeContent: false, sourceRoot: paths.sourceMapRelativePath}))
      .pipe(gulp.dest(paths.output)),
    tsResult.dts
      .pipe(gulp.dest(paths.output))
    ]);
});

function buildModule(moduleType, dirName) {
  return gulp.src(paths.output + jsName)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(to5(assign({}, compilerOptions, { modules: moduleType })))
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(paths.output + dirName));
}

// copies js file from ts output for ES6 build
gulp.task('build-es6', function () {
  return gulp.src(paths.output + jsName)
    .pipe(gulp.dest(paths.output + 'es6'));
});

// builds js file as ES5 with CommonJS module
gulp.task('build-commonjs', function () {
  return buildModule('common', 'commonjs');
});

// builds js file as ES5 with AMD module
gulp.task('build-amd', function () {
  return buildModule('amd', 'amd');
});

// builds js file as ES5 with SystemJS module
gulp.task('build-system', function () {
  return buildModule('system', 'system');
});

// copies the ts declaration file for each module build 
gulp.task('build-dts', function() {
  return gulp.src([paths.output + paths.packageName + '.d.ts', paths.typings])
    .pipe(gulp.dest(paths.output + 'es6'))
    .pipe(gulp.dest(paths.output + 'commonjs'))
    .pipe(gulp.dest(paths.output + 'amd'))
    .pipe(gulp.dest(paths.output + 'system'));
});

// main build task
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'build-index',
    'build-ts',
    ['build-es6', 'build-commonjs', 'build-amd', 'build-system'],
    'build-dts',
    callback
  );
});
