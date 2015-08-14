import * as LogManager from 'aurelia-logging';

const logger = LogManager.getLogger('event-aggregator');

class Handler {
  constructor(messageType, callback){
    this.messageType = messageType;
    this.callback = callback;
  }

  handle(message){
    if(message instanceof this.messageType){
      executeHandler(() => this.callback.call(null, message));
    }
  }
}

function executeHandler(handler) {
  try {
    handler();
  } catch(e) {
    logger.error(e);
  }
}

export class EventAggregator {
  constructor(){
    this.eventLookup = {};
    this.messageHandlers = [];
  }

  publish(event: string | any, data?: any){
    var subscribers, i;

    if(typeof event === 'string'){
      subscribers = this.eventLookup[event];
      if(subscribers){
        subscribers = subscribers.slice();
        i = subscribers.length;

        while(i--) {
          executeHandler(() => subscribers[i](data, event));
        }
      }
    }else{
      subscribers = this.messageHandlers.slice();
      i = subscribers.length;

      while(i--) {
        subscribers[i].handle(event);
      }
    }
  }

  subscribe(event: string | Function, callback: Function): Function {
    var subscribers, handler;

    if(typeof event === 'string'){
      subscribers = this.eventLookup[event] || (this.eventLookup[event] = []);

      subscribers.push(callback);

      return function(){
        var idx = subscribers.indexOf(callback);
        if (idx != -1) {
          subscribers.splice(idx, 1);
        }
      };
    }else{
      handler = new Handler(event, callback);
      subscribers = this.messageHandlers;

      subscribers.push(handler);

      return function(){
        var idx = subscribers.indexOf(handler);
        if (idx != -1) {
          subscribers.splice(idx, 1);
        }
      };
    }
  }

  subscribeOnce(event: string | Function, callback: Function): Function {
    var sub = this.subscribe(event,function(data,event){
      sub();
      return callback(data,event);
    });
    return sub;
  }
}

export function includeEventsIn(obj: Object): EventAggregator {
  var ea = new EventAggregator();

  obj.subscribeOnce = function(event, callback){
    return ea.subscribeOnce(event, callback);
  };

  obj.subscribe = function(event, callback){
    return ea.subscribe(event, callback);
  };

  obj.publish = function(event, data){
    ea.publish(event, data);
  };

  return ea;
}

export function configure(config: Object): void {
  config.instance(EventAggregator, includeEventsIn(config.aurelia));
}
