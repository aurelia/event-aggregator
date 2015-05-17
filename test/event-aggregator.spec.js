import {EventAggregator} from '../src/index';

describe('event aggregator', () =>{

  describe('subscribe', () =>{

    describe('string events', () =>{

      it('should not remove another callback when execute called twice', ()=>{
        var ea = new EventAggregator();

        var data = 0;

        var executeMe = ea.subscribe('dinner', function() {});
        ea.subscribe('dinner', function() { data = 1; });

        executeMe();
        executeMe();

        ea.publish('dinner');

        expect(data).toBe(1);
      });

      it('adds event with callback to the eventLookup object', () =>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribe('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
      });

      it('adds multiple callbacks the same event', () =>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribe('dinner', callback);

        var callback2 = function(){};
        ea.subscribe('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
        expect(ea.eventLookup.dinner[1]).toBe(callback2);
      });

      it('removes the callback after execution', ()=>{
        var ea = new EventAggregator();

        var callback = function(){};
        var executeMe = ea.subscribe('dinner', callback);

        var callback2 = function(){};
        var executeMeToo = ea.subscribe('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
        expect(ea.eventLookup.dinner[1]).toBe(callback2);

        executeMe();

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback2);

        executeMeToo();
        expect(ea.eventLookup.dinner.length).toBe(0);
      });

      it('will respond to an event any time it is published', ()=>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribe('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback);

        ea.publish('dinner');
        ea.publish('dinner');
        ea.publish('dinner');

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
      });

      it('will pass published data to the callback function', ()=>{
        var ea = new EventAggregator();

        var data = null;
        var callback = function(d){ data = d;};
        ea.subscribe('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback);

        ea.publish('dinner',{foo:"bar"});
        expect(data.foo).toBe("bar");
      });

    });

    describe('handler events', () =>{

      it('should not remove another handler when execute called twice', ()=>{
        var ea = new EventAggregator();

        var data = 0;

        var executeMe = ea.subscribe(DinnerEvent, function() {});
        ea.subscribe(AnotherDinnerEvent, function() { data = 1; });

        executeMe();
        executeMe();

        ea.publish(new AnotherDinnerEvent(""));

        expect(data).toBe(1);
      });

      it('adds handler with messageType and callback to the messageHandlers array', ()=>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribe(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        expect(ea.messageHandlers[0].messageType).toBe(DinnerEvent);
        expect(ea.messageHandlers[0].callback).toBe(callback);
      });

      it('removes the handler after execution', () =>{
        var ea = new EventAggregator();

        var callback = function(){};
        var executeMe = ea.subscribe(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        executeMe();
        expect(ea.messageHandlers.length).toBe(0);
      });

    });

  });

  describe('subscribeOnce', () =>{

    describe('string events', () =>{

      it('adds event with an anynomous function that will execute the callback to the eventLookup object', ()=>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribeOnce('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);
      });

      it('adds multiple callbacks the same event', () =>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribeOnce('dinner', callback);

        var callback2 = function(){};
        ea.subscribeOnce('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);
        expect(ea.eventLookup.dinner[1] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[1] === "function").toBe(true);
      });

      it('removes the callback after execution', ()=>{
        var ea = new EventAggregator();

        var callback = function(){};
        var executeMe = ea.subscribeOnce('dinner', callback);

        var callback2 = function(){};
        var executeMeToo = ea.subscribeOnce('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);
        expect(ea.eventLookup.dinner[1] === callback2).toBe(false);
        expect(typeof ea.eventLookup.dinner[1] === "function").toBe(true);

        executeMe();

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);

        executeMeToo();
        expect(ea.eventLookup.dinner.length).toBe(0);
      });

      it('will respond to an event only once', ()=>{
        var ea = new EventAggregator();

        var data = null;

        var callback = function(){data = "something";};
        ea.subscribeOnce('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);

        ea.publish('dinner');
        expect(data).toBe("something");

        expect(ea.eventLookup.dinner.length).toBe(0);

        data = null;
        ea.publish('dinner');
        expect(data).toBe(null);
      });

      it('will pass published data to the callback function', ()=>{
        var ea = new EventAggregator();

        var data = null;
        var callback = function(d){data = d;};
        ea.subscribeOnce('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);

        ea.publish('dinner',{foo:"bar"});
        expect(data.foo).toBe("bar");

        data = null;
        ea.publish('dinner');
        expect(data).toBe(null);
      });
    });

    describe('handler events', () =>{

      it('adds handler with messageType and callback to the messageHandlers array', ()=>{
        var ea = new EventAggregator();

        var callback = function(){};
        ea.subscribeOnce(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        expect(ea.messageHandlers[0].messageType).toBe(DinnerEvent);
        expect(ea.messageHandlers[0].callback === callback).toBe(false);
        expect(typeof ea.messageHandlers[0].callback === "function").toBe(true);

      });

      it('removes the handler after execution', () =>{
        var ea = new EventAggregator();

        var callback = function(){};
        var executeMe = ea.subscribeOnce(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        executeMe();
        expect(ea.messageHandlers.length).toBe(0);
      });

    });

  });

  describe('publish', () =>{

    describe('string events', () =>{

      it('calls the callback functions for the event', () =>{
        var ea = new EventAggregator();

        var someData, someData2;

        var callback = function(data){
          someData = data;
        };
        ea.subscribe('dinner', callback);

        var callback2 = function(data){
          someData2 = data;
        };
        ea.subscribe('dinner', callback2);

        var data = {foo: 'bar'};
        ea.publish('dinner', data);

        expect(someData).toBe(data);
        expect(someData2).toBe(data);
      });

      it('does not call the callback functions if subscriber does not exist', () =>{
        var ea = new EventAggregator();

        var someData;

        var callback = function(data){
          someData = data;
        };
        ea.subscribe('dinner', callback);

        ea.publish('garbage', {});

        expect(someData).toBeUndefined();
      });

      it('handles errors in subscriber callbacks', () => {
        var ea = new EventAggregator();

        var someMessage;

        var crash = function() {
          throw new Error('oops');
        }

        var callback = function(message){
          someMessage = message;
        };

        var data = {foo: 'bar'};

        ea.subscribe('dinner', crash);
        ea.subscribe('dinner', callback);

        ea.publish('dinner', data);

        expect(someMessage).toBe(data);
      });

    });

    describe('handler events', () =>{

      it('calls the callback functions for the event', () =>{
        var ea = new EventAggregator();

        var someMessage;

        var callback = function(message){
          someMessage = message;
        };
        ea.subscribe(DinnerEvent, callback);

        var americanDinner = new DinnerEvent('Cajun chicken');
        ea.publish(americanDinner);

        expect(someMessage.message).toBe('Cajun chicken');

        var swedishDinner = new DinnerEvent('Meatballs');
        ea.publish(swedishDinner);

        expect(someMessage.message).toBe('Meatballs');
      });

      it('does not call the callback funtions if message is not an instance of the messageType', ()=>{
        var ea = new EventAggregator();

        var someMessage;

        var callback = function(message){
          someMessage = message;
        };
        ea.subscribe(DinnerEvent, callback);

        ea.publish(new DrinkingEvent());

        expect(someMessage).toBeUndefined();
      });


      it('handles errors in subscriber callbacks', () => {
        var ea = new EventAggregator();

        var someMessage;

        var crash = function() {
          throw new Error('oops');
        }

        var callback = function(message){
          someMessage = message;
        };

        var data = {foo: 'bar'};

        ea.subscribe(DinnerEvent, crash);
        ea.subscribe(DinnerEvent, callback);

        ea.publish(new DinnerEvent(data));

        expect(someMessage.message).toBe(data);
      });

    });

  });

});

class DinnerEvent {
  constructor(message){
    this._message = message;
  }

  get message(){
    return this._message;
  }
}

class AnotherDinnerEvent {
  constructor(message){
    this._message = message;
  }

  get message(){
    return this._message;
  }
}

class DrinkingEvent {}
