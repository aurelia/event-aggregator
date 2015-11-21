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
export declare class EventAggregator {
    private eventLookup;
    private messageHandlers;
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
}
/**
* Includes Event Aggregator functionality into an object instance.
* @param obj The object to mix Event Aggregator functionality into.
*/
export declare function includeEventsIn(obj: any): EventAggregator;
/**
* Configures a global Event Aggregator by merging functionality into the Aurelia instance.
* @param config The Aurelia Framework configuration object used to configure the plugin.
*/
export declare function configure(config: any): void;
