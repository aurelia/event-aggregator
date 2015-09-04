System.register(['aurelia-logging'], function (_export) {
  'use strict';

  var LogManager, logger, Handler, EventAggregator;

  _export('includeEventsIn', includeEventsIn);

  _export('configure', configure);

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function includeEventsIn(obj) {
    var ea = new EventAggregator();

    obj.subscribeOnce = function (event, callback) {
      return ea.subscribeOnce(event, callback);
    };

    obj.subscribe = function (event, callback) {
      return ea.subscribe(event, callback);
    };

    obj.publish = function (event, data) {
      ea.publish(event, data);
    };

    return ea;
  }

  function configure(config) {
    config.instance(EventAggregator, includeEventsIn(config.aurelia));
  }

  return {
    setters: [function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      logger = LogManager.getLogger('event-aggregator');

      Handler = (function () {
        function Handler(messageType, callback) {
          _classCallCheck(this, Handler);

          this.messageType = messageType;
          this.callback = callback;
        }

        Handler.prototype.handle = function handle(message) {
          if (message instanceof this.messageType) {
            this.callback.call(null, message);
          }
        };

        return Handler;
      })();

      EventAggregator = (function () {
        function EventAggregator() {
          _classCallCheck(this, EventAggregator);

          this.eventLookup = {};
          this.messageHandlers = [];
        }

        EventAggregator.prototype.publish = function publish(event, data) {
          var subscribers = undefined;
          var i = undefined;

          if (typeof event === 'string') {
            subscribers = this.eventLookup[event];
            if (subscribers) {
              subscribers = subscribers.slice();
              i = subscribers.length;

              try {
                while (i--) {
                  subscribers[i](data, event);
                }
              } catch (e) {
                logger.error(e);
              }
            }
          } else {
            subscribers = this.messageHandlers.slice();
            i = subscribers.length;

            try {
              while (i--) {
                subscribers[i].handle(event);
              }
            } catch (e) {
              logger.error(e);
            }
          }
        };

        EventAggregator.prototype.subscribe = function subscribe(event, callback) {
          var subscribers = undefined;
          var handler = undefined;

          if (typeof event === 'string') {
            subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
            subscribers.push(callback);

            return function () {
              var idx = subscribers.indexOf(callback);
              if (idx !== -1) {
                subscribers.splice(idx, 1);
              }
            };
          }

          handler = new Handler(event, callback);
          subscribers = this.messageHandlers;
          subscribers.push(handler);

          return function () {
            var idx = subscribers.indexOf(handler);
            if (idx !== -1) {
              subscribers.splice(idx, 1);
            }
          };
        };

        EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
          var sub = this.subscribe(event, function (a, b) {
            sub();
            return callback(a, b);
          });

          return sub;
        };

        return EventAggregator;
      })();

      _export('EventAggregator', EventAggregator);
    }
  };
});