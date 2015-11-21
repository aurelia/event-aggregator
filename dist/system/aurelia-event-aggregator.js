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
            return ea.publish(event, data);
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
                    var handler = undefined;
                    var subscribers = undefined;
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
            })();

            _export('EventAggregator', EventAggregator);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1cmVsaWEtZXZlbnQtYWdncmVnYXRvci50cyJdLCJuYW1lcyI6WyJpbmNsdWRlRXZlbnRzSW4iLCJjb25maWd1cmUiLCJIYW5kbGVyIiwiSGFuZGxlci5jb25zdHJ1Y3RvciIsIkhhbmRsZXIuaGFuZGxlIiwiRXZlbnRBZ2dyZWdhdG9yIiwiRXZlbnRBZ2dyZWdhdG9yLmNvbnN0cnVjdG9yIiwiRXZlbnRBZ2dyZWdhdG9yLnB1Ymxpc2giLCJFdmVudEFnZ3JlZ2F0b3Iuc3Vic2NyaWJlIiwiRXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZS5kaXNwb3NlIiwiRXZlbnRBZ2dyZWdhdG9yLnN1YnNjcmliZU9uY2UiXSwibWFwcGluZ3MiOiI7OztvQkFFTSxNQUFNLEVBRVosT0FBQSxFQXdCQSxlQUFBOzs7Ozs7OztBQTZHQSxhQUFBLGVBQUEsQ0FBZ0MsR0FBUSxFQUFBO0FBQ3RDQSxZQUFJQSxFQUFFQSxHQUFHQSxJQUFJQSxlQUFlQSxFQUFFQSxDQUFDQTtBQUMvQkEsV0FBR0EsQ0FBQ0EsYUFBYUEsR0FBR0EsVUFBQ0EsS0FBVUEsRUFBRUEsUUFBYUE7bUJBQUtBLEVBQUVBLENBQUNBLGFBQWFBLENBQUNBLEtBQUtBLEVBQUVBLFFBQVFBLENBQUNBO1NBQUFBLENBQUNBO0FBQ3JGQSxXQUFHQSxDQUFDQSxTQUFTQSxHQUFHQSxVQUFDQSxLQUFVQSxFQUFFQSxRQUFhQTttQkFBS0EsRUFBRUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsS0FBS0EsRUFBRUEsUUFBUUEsQ0FBQ0E7U0FBQUEsQ0FBQ0E7QUFDN0VBLFdBQUdBLENBQUNBLE9BQU9BLEdBQUdBLFVBQUNBLEtBQVVBLEVBQUVBLElBQVVBO21CQUFLQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQTtTQUFBQSxDQUFDQTtBQUNsRUEsZUFBT0EsRUFBRUEsQ0FBQ0E7S0FDWEE7O0FBTUQsYUFBQSxTQUFBLENBQTBCLE1BQVcsRUFBQTtBQUNuQ0MsY0FBTUEsQ0FBQ0EsUUFB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Y2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBMb2dNYW5hZ2VyIGZyb20gJ2F1cmVsaWEtbG9nZ2luZyc7XHJcblxyXG5jb25zdCBsb2dnZXIgPSBMb2dNYW5hZ2VyLmdldExvZ2dlcignZXZlbnQtYWdncmVnYXRvcicpO1xyXG5cclxuY2xhc3MgSGFuZGxlciB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBtZXNzYWdlVHlwZTogYW55LCBwcml2YXRlIGNhbGxiYWNrOiAobWVzc2FnZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgfVxyXG5cclxuICBoYW5kbGUobWVzc2FnZTogYW55KSB7XHJcbiAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIHRoaXMubWVzc2FnZVR5cGUpIHtcclxuICAgICAgdGhpcy5jYWxsYmFjay5jYWxsKG51bGwsIG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiogUmVwcmVzZW50cyBhIGRpc3Bvc2FibGUgc3Vic2NpcHRpb24gdG8gYW4gRXZlbnRBZ2dyZWdhdG9yIGV2ZW50LlxyXG4qL1xyXG5leHBvcnQgaW50ZXJmYWNlIFN1YnNjcmlwdGlvbiB7XHJcbiAgLyoqXHJcbiAgKiBEaXNwb3NlcyB0aGUgc3Vic2NyaXB0aW9uLlxyXG4gICovXHJcbiAgZGlzcG9zZSgpOiB2b2lkO1xyXG59XHJcblxyXG4vKipcclxuKiBFbmFibGVzIGxvb3NlbHkgY291cGxlZCBwdWJsaXNoL3N1YnNjcmliZSBtZXNzYWdpbmcuXHJcbiovXHJcbmV4cG9ydCBjbGFzcyBFdmVudEFnZ3JlZ2F0b3Ige1xyXG4gIHByaXZhdGUgZXZlbnRMb29rdXA6IGFueSA9IHt9O1xyXG4gIHByaXZhdGUgbWVzc2FnZUhhbmRsZXJzOiBIYW5kbGVyW10gPSBbXTtcclxuXHJcbiAgLyoqXHJcbiAgKiBQdWJsaXNoZXMgYSBtZXNzYWdlLlxyXG4gICogQHBhcmFtIGV2ZW50IFRoZSBtZXNzYWdlIGRhdGEgdHlwZSB0byBwdWJsaXNoIHRvLlxyXG4gICovXHJcbiAgcHVibGlzaDxUPihldmVudDogVCk6IHZvaWQ7XHJcbiAgLyoqXHJcbiAgKiBQdWJsaXNoZXMgYSBtZXNzYWdlLlxyXG4gICogQHBhcmFtIGV2ZW50IFRoZSBtZXNzYWdlIGNoYW5uZWwgdG8gcHVibGlzaCB0by5cclxuICAqIEBwYXJhbSBkYXRhIFRoZSBkYXRhIHRvIHB1Ymxpc2ggb24gdGhlIGNoYW5uZWwuXHJcbiAgKi9cclxuICBwdWJsaXNoKGV2ZW50OiBzdHJpbmcsIGRhdGE/OiBhbnkpOiB2b2lkO1xyXG4gIHB1Ymxpc2goZXZlbnQ6IGFueSwgZGF0YT86IGFueSk6IHZvaWQge1xyXG4gICAgbGV0IHN1YnNjcmliZXJzOiBhbnlbXTtcclxuICAgIGxldCBpOiBudW1iZXI7XHJcblxyXG4gICAgaWYgKHR5cGVvZiBldmVudCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgc3Vic2NyaWJlcnMgPSB0aGlzLmV2ZW50TG9va3VwW2V2ZW50XTtcclxuICAgICAgaWYgKHN1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlcnMgPSBzdWJzY3JpYmVycy5zbGljZSgpO1xyXG4gICAgICAgIGkgPSBzdWJzY3JpYmVycy5sZW5ndGg7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICB3aGlsZSAoaS0tKSB7XHJcbiAgICAgICAgICAgIHN1YnNjcmliZXJzW2ldKGRhdGEsIGV2ZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdWJzY3JpYmVycyA9IHRoaXMubWVzc2FnZUhhbmRsZXJzLnNsaWNlKCk7XHJcbiAgICAgIGkgPSBzdWJzY3JpYmVycy5sZW5ndGg7XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlIChpLS0pIHtcclxuICAgICAgICAgIHN1YnNjcmliZXJzW2ldLmhhbmRsZShldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIFN1YnNjcmliZXMgdG8gYSBtZXNzYWdlIHR5cGUuXHJcbiAgKiBAcGFyYW0gZXZlbnQgVGhlIG1lc3NhZ2UgZGF0YSBUeXBlIHRvIHN1YnNjcmliZSB0by5cclxuICAqIEBwYXJhbSBjYWxsYmFjayBUaGUgY2FsbGJhY2sgdG8gYmUgaW52b2tlZCB3aGVuIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSBpcyBwdWJsaXNoZWQuXHJcbiAgKi9cclxuICBzdWJzY3JpYmU8VD4oZXZlbnQ6IENvbnN0cnVjdG9yPFQ+LCBjYWxsYmFjazogKG1lc3NhZ2U6IFQpID0+IHZvaWQpOiBTdWJzY3JpcHRpb247XHJcbiAgLyoqXHJcbiAgKiBTdWJzY3JpYmVzIHRvIGEgbWVzc2FnZSBjaGFubmVsLlxyXG4gICogQHBhcmFtIGV2ZW50IFRoZSBtZXNzYWdlIGNoYW5uZWwgdG8gc3Vic2NyaWJlIHRvLlxyXG4gICogQHBhcmFtIGNhbGxiYWNrIFRoZSBjYWxsYmFjayB0byBiZSBpbnZva2VkIHdoZW4gdGhlIHNwZWNpZmllZCBtZXNzYWdlIGlzIHB1Ymxpc2hlZC5cclxuICAqL1xyXG4gIHN1YnNjcmliZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogKG1lc3NhZ2U6IGFueSwgZXZlbnQ/OiBzdHJpbmcpID0+IHZvaWQpOiBTdWJzY3JpcHRpb247XHJcbiAgc3Vic2NyaWJlKGV2ZW50OiBzdHJpbmd8Q29uc3RydWN0b3I8YW55PiwgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnksIGV2ZW50Pzogc3RyaW5nKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uIHtcclxuICAgIGxldCBoYW5kbGVyOiBGdW5jdGlvbnxIYW5kbGVyO1xyXG4gICAgbGV0IHN1YnNjcmliZXJzOiBhbnlbXTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGV2ZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICBoYW5kbGVyID0gY2FsbGJhY2s7XHJcbiAgICAgIHN1YnNjcmliZXJzID0gdGhpcy5ldmVudExvb2t1cFtldmVudF0gfHwgKHRoaXMuZXZlbnRMb29rdXBbZXZlbnRdID0gW10pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGFuZGxlciA9IG5ldyBIYW5kbGVyKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgICAgIHN1YnNjcmliZXJzID0gdGhpcy5tZXNzYWdlSGFuZGxlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlcnMucHVzaChoYW5kbGVyKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkaXNwb3NlKCkge1xyXG4gICAgICAgIGxldCBpZHggPSBzdWJzY3JpYmVycy5pbmRleE9mKGhhbmRsZXIpO1xyXG4gICAgICAgIGlmIChpZHggIT09IC0xKSB7XHJcbiAgICAgICAgICBzdWJzY3JpYmVycy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAqIFN1YnNjcmliZXMgdG8gYSBtZXNzYWdlIHR5cGUsIHRoZW4gZGlzcG9zZXMgdGhlIHN1YnNjcmlwdGlvbiBhdXRvbWF0aWNhbGx5IGFmdGVyIHRoZSBmaXJzdCBtZXNzYWdlIGlzIHJlY2VpdmVkLlxyXG4gICogQHBhcmFtIGV2ZW50IFRoZSBtZXNzYWdlIGRhdGEgVHlwZSB0byBzdWJzY3JpYmUgdG8uXHJcbiAgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB3aGVuIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSBpcyBwdWJsaXNoZWQuXHJcbiAgKi9cclxuICBzdWJzY3JpYmVPbmNlPFQ+KGV2ZW50OiBDb25zdHJ1Y3RvcjxUPiwgY2FsbGJhY2s6IChtZXNzYWdlOiBUKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xyXG4gIC8qKlxyXG4gICogU3Vic2NyaWJlcyB0byBhIG1lc3NhZ2UgY2hhbm5lbCwgdGhlbiBkaXNwb3NlcyB0aGUgc3Vic2NyaXB0aW9uIGF1dG9tYXRpY2FsbHkgYWZ0ZXIgdGhlIGZpcnN0IG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXHJcbiAgKiBAcGFyYW0gZXZlbnQgVGhlIG1lc3NhZ2UgY2hhbm5lbCB0byBzdWJzY3JpYmUgdG8uXHJcbiAgKiBAcGFyYW0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2hlbiB3aGVuIHRoZSBzcGVjaWZpZWQgbWVzc2FnZSBpcyBwdWJsaXNoZWQuXHJcbiAgKi9cclxuICBzdWJzY3JpYmVPbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiAobWVzc2FnZTogYW55LCBldmVudD86IHN0cmluZykgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbjtcclxuICBzdWJzY3JpYmVPbmNlKGV2ZW50OiBzdHJpbmd8Q29uc3RydWN0b3I8YW55PiwgY2FsbGJhY2s6IChtZXNzYWdlOiBhbnksIGV2ZW50Pzogc3RyaW5nKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uIHtcclxuICAgIGxldCBzdWIgPSB0aGlzLnN1YnNjcmliZSg8YW55PmV2ZW50LCAoYSwgYikgPT4ge1xyXG4gICAgICBzdWIuZGlzcG9zZSgpO1xyXG4gICAgICByZXR1cm4gY2FsbGJhY2soYSwgYik7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gc3ViO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiogSW5jbHVkZXMgRXZlbnQgQWdncmVnYXRvciBmdW5jdGlvbmFsaXR5IGludG8gYW4gb2JqZWN0IGluc3RhbmNlLlxyXG4qIEBwYXJhbSBvYmogVGhlIG9iamVjdCB0byBtaXggRXZlbnQgQWdncmVnYXRvciBmdW5jdGlvbmFsaXR5IGludG8uXHJcbiovXHJcbmV4cG9ydCBmdW5jdGlvbiBpbmNsdWRlRXZlbnRzSW4ob2JqOiBhbnkpOiBFdmVudEFnZ3JlZ2F0b3Ige1xyXG4gIGxldCBlYSA9IG5ldyBFdmVudEFnZ3JlZ2F0b3IoKTtcclxuICBvYmouc3Vic2NyaWJlT25jZSA9IChldmVudDogYW55LCBjYWxsYmFjazogYW55KSA9PiBlYS5zdWJzY3JpYmVPbmNlKGV2ZW50LCBjYWxsYmFjayk7XHJcbiAgb2JqLnN1YnNjcmliZSA9IChldmVudDogYW55LCBjYWxsYmFjazogYW55KSA9PiBlYS5zdWJzY3JpYmUoZXZlbnQsIGNhbGxiYWNrKTtcclxuICBvYmoucHVibGlzaCA9IChldmVudDogYW55LCBkYXRhPzogYW55KSA9PiBlYS5wdWJsaXNoKGV2ZW50LCBkYXRhKTtcclxuICByZXR1cm4gZWE7XHJcbn1cclxuXHJcbi8qKlxyXG4qIENvbmZpZ3VyZXMgYSBnbG9iYWwgRXZlbnQgQWdncmVnYXRvciBieSBtZXJnaW5nIGZ1bmN0aW9uYWxpdHkgaW50byB0aGUgQXVyZWxpYSBpbnN0YW5jZS5cclxuKiBAcGFyYW0gY29uZmlnIFRoZSBBdXJlbGlhIEZyYW1ld29yayBjb25maWd1cmF0aW9uIG9iamVjdCB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgcGx1Z2luLlxyXG4qL1xyXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZzogYW55KTogdm9pZCB7XHJcbiAgY29uZmlnLmluc3RhbmNlKEV2ZW50QWdncmVnYXRvciwgaW5jbHVkZUV2ZW50c0luKGNvbmZpZy5hdXJlbGlhKSk7XHJcbn1cclxuIl19
