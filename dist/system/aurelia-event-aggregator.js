'use strict';

System.register(['aurelia-logging'], function (_export, _context) {
  "use strict";

  var LogManager, logger, Handler, EventAggregator;

  

  function invokeCallback(callback, data, event) {
    try {
      callback(data, event);
    } catch (e) {
      logger.error(e);
    }
  }

  function invokeHandler(handler, data) {
    try {
      handler.handle(data);
    } catch (e) {
      logger.error(e);
    }
  }

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

  _export('includeEventsIn', includeEventsIn);

  function configure(config) {
    config.instance(EventAggregator, includeEventsIn(config.aurelia));
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaLogging) {
      LogManager = _aureliaLogging;
    }],
    execute: function () {
      logger = LogManager.getLogger('event-aggregator');

      Handler = function () {
        function Handler(messageType, callback) {
          

          this.messageType = messageType;
          this.callback = callback;
        }

        Handler.prototype.handle = function handle(message) {
          if (message instanceof this.messageType) {
            this.callback.call(null, message);
          }
        };

        return Handler;
      }();

      _export('EventAggregator', EventAggregator = function () {
        function EventAggregator() {
          

          this.eventLookup = {};
          this.messageHandlers = [];
        }

        EventAggregator.prototype.publish = function publish(event, data) {
          var subscribers = void 0;
          var i = void 0;

          if (!event) {
            throw new Error('Event was invalid.');
          }

          if (typeof event === 'string') {
            subscribers = this.eventLookup[event];
            if (subscribers) {
              subscribers = subscribers.slice();
              i = subscribers.length;

              while (i--) {
                invokeCallback(subscribers[i], data, event);
              }
            }
          } else {
            subscribers = this.messageHandlers.slice();
            i = subscribers.length;

            while (i--) {
              invokeHandler(subscribers[i], event);
            }
          }
        };

        EventAggregator.prototype.subscribe = function subscribe(event, callback) {
          var handler = void 0;
          var subscribers = void 0;

          if (!event) {
            throw new Error('Event channel/type was invalid.');
          }

          if (typeof event === 'string') {
            handler = callback;
            subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
          } else {
            handler = new Handler(event, callback);
            subscribers = this.messageHandlers;
          }

          subscribers.push(handler);

          return {
            dispose: function dispose() {
              var idx = subscribers.indexOf(handler);
              if (idx !== -1) {
                subscribers.splice(idx, 1);
              }
            }
          };
        };

        EventAggregator.prototype.subscribeOnce = function subscribeOnce(event, callback) {
          var sub = this.subscribe(event, function (a, b) {
            sub.dispose();
            return callback(a, b);
          });

          return sub;
        };

        return EventAggregator;
      }());

      _export('EventAggregator', EventAggregator);
    }
  };
});