import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('event-aggregator');

class Handler {
  constructor(private messageType: any, private callback: (message: any) => void) {
  }

  handle(message: any) {
    if (message instanceof this.messageType) {
      this.callback.call(null, message);
    }
  }
}

/**
* Represents a disposable subsciption to an EventAggregator event.
*/
export interface Subscription {
  /**
  * Disposes the subscription.
  */
  dispose(): void;
}

/**
* Enables loosely coupled publish/subscribe messaging.
*/
export class EventAggregator {
  private eventLookup: any = {};
  private messageHandlers: Handler[] = [];

  /**
  * Publishes a message.
  * @param event The message data type to publish to.
  */
  publish<T>(event: T): void;
  /**
  * Publishes a message.
  * @param event The message channel to publish to.
  * @param data The data to publish on the channel.
  */
  publish(event: string, data?: any): void;
  publish(event: any, data?: any): void {
    let subscribers: any[];
    let i: number;

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
  }

  /**
  * Subscribes to a message type.
  * @param event The message data Type to subscribe to.
  * @param callback The callback to be invoked when the specified message is published.
  */
  subscribe<T>(event: Constructor<T>, callback: (message: T) => void): Subscription;
  /**
  * Subscribes to a message channel.
  * @param event The message channel to subscribe to.
  * @param callback The callback to be invoked when the specified message is published.
  */
  subscribe(event: string, callback: (message: any, event?: string) => void): Subscription;
  subscribe(event: string|Constructor<any>, callback: (message: any, event?: string) => void): Subscription {
    let handler: Function|Handler;
    let subscribers: any[];

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
  * Subscribes to a message type, then disposes the subscription automatically after the first message is received.
  * @param event The message data Type to subscribe to.
  * @param callback The callback to be invoked when when the specified message is published.
  */
  subscribeOnce<T>(event: Constructor<T>, callback: (message: T) => void): Subscription;
  /**
  * Subscribes to a message channel, then disposes the subscription automatically after the first message is received.
  * @param event The message channel to subscribe to.
  * @param callback The callback to be invoked when when the specified message is published.
  */
  subscribeOnce(event: string, callback: (message: any, event?: string) => void): Subscription;
  subscribeOnce(event: string|Constructor<any>, callback: (message: any, event?: string) => void): Subscription {
    let sub = this.subscribe(<any>event, (a, b) => {
      sub.dispose();
      return callback(a, b);
    });

    return sub;
  }
}

/**
* Includes Event Aggregator functionality into an object instance.
* @param obj The object to mix Event Aggregator functionality into.
*/
export function includeEventsIn(obj: any): EventAggregator {
  let ea = new EventAggregator();
  obj.subscribeOnce = (event: any, callback: any) => ea.subscribeOnce(event, callback);
  obj.subscribe = (event: any, callback: any) => ea.subscribe(event, callback);
  obj.publish = (event: any, data?: any) => ea.publish(event, data);
  return ea;
}

/**
* Configures a global Event Aggregator by merging functionality into the Aurelia instance.
* @param config The Aurelia Framework configuration object used to configure the plugin.
*/
export function configure(config: any): void {
  config.instance(EventAggregator, includeEventsIn(config.aurelia));
}
