import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('event-aggregator');

class Handler {
  constructor(messageType, callback) {
    this.messageType = messageType;
    this.callback = callback;
  }

  handle(message) {
    if (message instanceof this.messageType) {
      this.callback.call(null, message);
    }
  }
}

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

/**
* Represents a disposable subsciption to an EventAggregator event.
*/
interface Subscription {
  /**
  * Disposes the subscription.
  */
  dispose(): void;
}

/**
* Enables loosely coupled publish/subscribe messaging.
*/
export class EventAggregator {
  /**
  * Creates an instance of the EventAggregator class.
  */
  constructor() {
    this.eventLookup = {};
    this.messageHandlers = [];
  }

  /**
  * Publishes a message.
  * @param event The event or channel to publish to.
  * @param data The data to publish on the channel.
  */
  publish(event: string | any, data?: any): void {
    let subscribers;
    let i;

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
  }

  /**
  * Subscribes to a message channel or message type.
  * @param event The event channel or event data type.
  * @param callback The callback to be invoked when the specified message is published.
  */
  subscribe(event: string | Function, callback: Function): Subscription {
    let handler;
    let subscribers;

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
      dispose() {
        let idx = subscribers.indexOf(handler);
        if (idx !== -1) {
          subscribers.splice(idx, 1);
        }
      }
    };
  }

  /**
  * Subscribes to a message channel or message type, then disposes the subscription automatically after the first message is received.
  * @param event The event channel or event data type.
  * @param callback The callback to be invoked when the specified message is published.
  */
  subscribeOnce(event: string | Function, callback: Function): Subscription {
    let sub = this.subscribe(event, (a, b) => {
      sub.dispose();
      return callback(a, b);
    });

    return sub;
  }
}

/**
* Includes EA functionality into an object instance.
* @param obj The object to mix Event Aggregator functionality into.
*/
export function includeEventsIn(obj: Object): EventAggregator {
  let ea = new EventAggregator();

  obj.subscribeOnce = function(event, callback) {
    return ea.subscribeOnce(event, callback);
  };

  obj.subscribe = function(event, callback) {
    return ea.subscribe(event, callback);
  };

  obj.publish = function(event, data) {
    ea.publish(event, data);
  };

  return ea;
}

/**
* Configures a global EA by merging functionality into the Aurelia instance.
* @param config The Aurelia Framework configuration object used to configure the plugin.
*/
export function configure(config: Object): void {
  config.instance(EventAggregator, includeEventsIn(config.aurelia));
}
