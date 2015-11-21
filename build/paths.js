var path = require('path');
var fs = require('fs');

var appRoot = 'src/';
var pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
var outputRoot = 'dist/';

module.exports = {
  root: appRoot,
  tsSource: outputRoot + pkg.name + '.ts',
  jspmDefinitions: 'jspm_packages/**/*.d.ts',
  typings: 'typings/**/*.d.ts',
  source: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  style: 'styles/**/*.css',
  output: outputRoot,
  doc:'./doc',
  e2eSpecsSrc: 'test/e2e/src/*.js',
  e2eSpecsDist: 'test/e2e/dist/',
  packageName: pkg.name
};
