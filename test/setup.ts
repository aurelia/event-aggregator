let allTestFiles: string[] = [];
let allTemplatePaths: {[requirePath: string]: string} = {};
let TEST_REGEXP = /^\/base\/dist\/test\/test\/[^\/]+\.js$/i;
let TEMPLATE_REGEXP = /^\/base\/(src|test)\/.+\.html$/i;

interface Window {
  __karma__: any;
  require: any;
}

// Get a list of all the test files to include
Object.keys(window.__karma__.files).forEach(file => {
  if (TEST_REGEXP.test(file) && file !== '/base/dist/test/test/setup.js') {
    // Normalize paths to RequireJS module names.
    // If you require sub-dependencies of test files to be loaded as-is (requiring file extension)
    // then do not normalize the paths
    const normalizedTestModule = file.replace(/^\/base\/|\.js$/g, '');
    allTestFiles.push(normalizedTestModule);
  } else if (TEMPLATE_REGEXP.test(file)) {
    const normalizedTemplate = file.replace(/^\/base\//, '/base/dist/');
    allTemplatePaths[normalizedTemplate] = file;
  }
});

let started = false;

window.require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  deps: [],

  // we have to kickoff jasmine, as it is asynchronous
  callback: () => {
    if (started) {
      return;
    }
    started = true;
    window.require(allTestFiles, () => window.__karma__.start());
  },
  paths: {
    /* tslint:disable:max-line-length */
    'aurelia-binding': '/base/node_modules/aurelia-binding/dist/amd/aurelia-binding',
    'aurelia-bootstrapper': '/base/node_modules/aurelia-bootstrapper/dist/amd/aurelia-bootstrapper',
    'aurelia-dependency-injection': '/base/node_modules/aurelia-dependency-injection/dist/amd/aurelia-dependency-injection',
    'aurelia-event-aggregator': '/base/node_modules/aurelia-event-aggregator/dist/amd/aurelia-event-aggregator',
    'aurelia-framework': '/base/node_modules/aurelia-framework/dist/amd/aurelia-framework',
    'aurelia-history': '/base/node_modules/aurelia-history/dist/amd/aurelia-history',
    'aurelia-history-browser': '/base/node_modules/aurelia-history-browser/dist/amd/aurelia-history-browser',
    'aurelia-loader': '/base/node_modules/aurelia-loader/dist/amd/aurelia-loader',
    'aurelia-loader-default': '/base/node_modules/aurelia-loader-default/dist/amd/aurelia-loader-default',
    'aurelia-logging': '/base/node_modules/aurelia-logging/dist/amd/aurelia-logging',
    'aurelia-logging-console': '/base/node_modules/aurelia-logging-console/dist/amd/aurelia-logging-console',
    'aurelia-metadata': '/base/node_modules/aurelia-metadata/dist/amd/aurelia-metadata',
    'aurelia-pal': '/base/node_modules/aurelia-pal/dist/amd/aurelia-pal',
    'aurelia-pal-browser': '/base/node_modules/aurelia-pal-browser/dist/amd/aurelia-pal-browser',
    'aurelia-path': '/base/node_modules/aurelia-path/dist/amd/aurelia-path',
    'aurelia-polyfills': '/base/node_modules/aurelia-polyfills/dist/amd/aurelia-polyfills',
    'aurelia-router': '/base/node_modules/aurelia-router/dist/amd/aurelia-router',
    'aurelia-route-recognizer': '/base/node_modules/aurelia-route-recognizer/dist/amd/aurelia-route-recognizer',
    'aurelia-task-queue': '/base/node_modules/aurelia-task-queue/dist/amd/aurelia-task-queue',
    'aurelia-templating': '/base/node_modules/aurelia-templating/dist/amd/aurelia-templating',
    'aurelia-templating-binding': '/base/node_modules/aurelia-templating-binding/dist/amd/aurelia-templating-binding',
    /* tslint:enable:max-line-length */
    /* tslint:disable */
    'text': '/base/node_modules/requirejs-text/text',
    'template-registry-entry!dist/test/test/resources/my-component.html_unnormalized2': '/base/test/resources/my-component.html',
    /* tslint:enable */
    ...allTemplatePaths
  },
  packages: [
    {
      name: 'aurelia-event-aggregator',
      location: '/base/node_modules/aurelia-event-aggregator/dist/amd',
      main: 'aurelia-event-aggregator'
    }
  ]
});
