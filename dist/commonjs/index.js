'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaEventAggregator = require('./aurelia-event-aggregator');

Object.keys(_aureliaEventAggregator).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaEventAggregator[key];
    }
  });
});