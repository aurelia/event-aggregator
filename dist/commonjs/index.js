'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.includeEventsIn = includeEventsIn;
exports.install = install;

var Handler = (function () {
  function Handler(messageType, callback) {
    _classCallCheck(this, Handler);

    this.messageType = messageType;
    this.callback = callback;
  }

  _createClass(Handler, [{
    key: 'handle',
    value: function handle(message) {
      if (message instanceof this.messageType) {
        this.callback.call(null, message);
      }
    }
  }]);

  return Handler;
})();

var EventAggregator = (function () {
  function EventAggregator() {
    _classCallCheck(this, EventAggregator);

    this.eventLookup = {};
    this.messageHandlers = [];
  }

  _createClass(EventAggregator, [{
    key: 'publish',
    value: function publish(event, data) {
      var subscribers, i;

      if (typeof event === 'string') {
        subscribers = this.eventLookup[event];
        if (subscribers) {
          subscribers = subscribers.slice();
          i = subscribers.length;

          while (i--) {
            subscribers[i](data, event);
          }
        }
      } else {
        subscribers = this.messageHandlers.slice();
        i = subscribers.length;

        while (i--) {
          subscribers[i].handle(event);
        }
      }
    }
  }, {
    key: 'subscribe',
    value: function subscribe(event, callback) {
      var subscribers, handler;

      if (typeof event === 'string') {
        subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);

        subscribers.push(callback);

        return function () {
          subscribers.splice(subscribers.indexOf(callback), 1);
        };
      } else {
        handler = new Handler(event, callback);
        subscribers = this.messageHandlers;

        subscribers.push(handler);

        return function () {
          subscribers.splice(subscribers.indexOf(handler), 1);
        };
      }
    }
  }, {
    key: 'subscribeOnce',
    value: function subscribeOnce(event, callback) {
      var sub = this.subscribe(event, function (data, event) {
        sub();
        return callback(data, event);
      });
      return sub;
    }
  }]);

  return EventAggregator;
})();

exports.EventAggregator = EventAggregator;

function includeEventsIn(obj) {
  var ea = new EventAggregator();

  obj.subscribe = function (event, callback) {
    return ea.subscribe(event, callback);
  };

  obj.publish = function (event, data) {
    ea.publish(event, data);
  };

  return ea;
}

function install(aurelia) {
  aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
}