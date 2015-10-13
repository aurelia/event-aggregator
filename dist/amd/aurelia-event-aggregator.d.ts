declare module 'aurelia-event-aggregator' {
  import * as LogManager from 'aurelia-logging';
  export interface Subscription {
    dispose(): void;
  }
  class Handler {
    constructor(messageType: any, callback: any);
    handle(message: any): any;
  }
  export class EventAggregator {
    constructor();
    publish(event: string | any, data?: any): void;
    subscribe(event: string | Function, callback: Function): Subscription;
    subscribeOnce(event: string | Function, callback: Function): Subscription;
  }
  export function includeEventsIn(obj: Object): EventAggregator;
  export function configure(config: Object): void;
}