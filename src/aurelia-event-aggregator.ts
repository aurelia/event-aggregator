import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('event-aggregator');

export type Constructor<T = object> = new (...args: any[]) => T;
export type EventCallback<T = any> = (data: T, event?: string) => any;

export class Handler {
  constructor(public messageType: Constructor, public callback: EventCallback) {}

  public handle(message: object) {
    if (message instanceof this.messageType) {
      this.callback.call(null, message);
    }
  }
}

function invokeCallback(callback: EventCallback, data: any, event: string) {
  try {
    callback(data, event);
  } catch (e) {
    logger.error(e);
  }
}

function invokeHandler(handler: Handler, data: object) {
  try {
    handler.handle(data);
  } catch (e) {
    logger.error(e);
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
  /**
   * Creates an instance of the EventAggregator class.
   */
  constructor(
    private eventLookup: {[event: string]: EventCallback[]} = {},
    private messageHandlers: Handler[] = []
  ) {}

  /**
   * Publishes a message.
   * @param event The event or channel to publish to.
   * @param data The data to publish on the channel.
   */
  public publish(event: string | object, data?: any): void {
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
   * @param callback The callback to be invoked when when the specified message is published.
   */
  public subscribe<T = any>(event: string | Constructor<T>, callback: EventCallback<T>): Subscription {
    let handler: EventCallback | Handler;
    let subscribers: Array<EventCallback | Handler>;

    if (!event) {
      throw new Error('Event channel/type was invalid.');
    }

    if (typeof event === 'string') {
      handler = callback;
      subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);
    } else {
      handler = new Handler(event as any, callback);
      subscribers = this.messageHandlers;
    }

    subscribers.push(handler);

    return {
      dispose() {
        const idx = subscribers.indexOf(handler);
        if (idx !== -1) {
          subscribers.splice(idx, 1);
        }
      }
    };
  }

  /**
   * Subscribes to a message channel or message type, then disposes the subscription automatically
   * after the first message is received.
   * @param event The event channel or event data type.
   * @param callback The callback to be invoked when when the specified message is published.
   */
  public subscribeOnce<T = any>(event: string | Constructor<T>, callback: EventCallback<T>): Subscription {
    const sub = this.subscribe(event, (a, b) => {
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
export function includeEventsIn(obj: any): EventAggregator {
  const ea = new EventAggregator();

  obj.subscribeOnce = (event: string | Constructor, callback: (data?: any) => any) => {
    return ea.subscribeOnce(event, callback);
  };

  obj.subscribe = (event: string | Constructor, callback: (data?: any) => any) => {
    return ea.subscribe(event, callback);
  };

  obj.publish = (event: string | Constructor, data?: any) => {
    ea.publish(event, data);
  };

  return ea;
}

/**
 * Configures a global EA by merging functionality into the Aurelia instance.
 * @param config The Aurelia Framework configuration object used to configure the plugin.
 */
export function configure(
  config: {instance: (cls: typeof EventAggregator, ea: EventAggregator) => void, aurelia: object}
): void {
  config.instance(EventAggregator, includeEventsIn(config.aurelia));
}
