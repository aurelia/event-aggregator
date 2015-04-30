class Handler {
  constructor(messageType, callback){
    this.messageType = messageType;
    this.callback = callback;
  }

  handle(message){
    if(message instanceof this.messageType){
      this.callback.call(null, message);
    }
  }
}

export class EventAggregator {
  constructor(){
    this.eventLookup = {};
    this.messageHandlers = [];
  }

  publish(event, data){
    var subscribers, i;

    if(typeof event === 'string'){
      subscribers = this.eventLookup[event];
      if(subscribers){
        subscribers = subscribers.slice();
        i = subscribers.length;

        while(i--) {
          subscribers[i](data, event);
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

  subscribe(event, callback){
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

  subscribeOnce(event, callback){
    var sub = this.subscribe(event,function(data,event){
      sub();
      return callback(data,event);
    });
    return sub;
  }
}

export function includeEventsIn(obj){
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

export function configure(aurelia){
  aurelia.withInstance(EventAggregator, includeEventsIn(aurelia));
}
