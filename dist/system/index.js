System.register([], function (_export) {
  "use strict";

  var Handler, EventAggregator;
  _export("includeEventsIn", includeEventsIn);

  _export("install", install);

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
  return {
    setters: [],
    execute: function () {
      Handler = function Handler(messageType, callback) {
        this.messageType = messageType;
        this.callback = callback;
      };

      Handler.prototype.handle = function (message) {
        if (message instanceof this.messageType) {
          this.callback.call(null, message);
        }
      };

      EventAggregator = function EventAggregator() {
        this.eventLookup = {};
        this.messageHandlers = [];
      };

      EventAggregator.prototype.publish = function (event, data) {
        var subscribers, i, handler;

        if (typeof event === "string") {
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
      };

      EventAggregator.prototype.subscribe = function (event, callback) {
        var subscribers, handler;

        if (typeof event === "string") {
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
      };

      _export("EventAggregator", EventAggregator);
    }
  };
});