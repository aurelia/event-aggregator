import {EventAggregator} from '../src/index';

describe('event aggregator', () => {

  describe('subscribe', () => {

    describe('string events', () => {

      it('should not remove another callback when execute called twice', ()=>{
        let ea = new EventAggregator();
        let data = 0;

        let subscription = ea.subscribe('dinner', function() {});
        ea.subscribe('dinner', function() { data = 1; });

        subscription.dispose();
        subscription.dispose();

        ea.publish('dinner');

        expect(data).toBe(1);
      });

      it('adds event with callback to the eventLookup object', () =>{
        let ea = new EventAggregator();
        let callback = function(){};
        ea.subscribe('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
      });

      it('adds multiple callbacks the same event', () =>{
        let ea = new EventAggregator();
        let callback = function(){};
        ea.subscribe('dinner', callback);

        let callback2 = function(){};
        ea.subscribe('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
        expect(ea.eventLookup.dinner[1]).toBe(callback2);
      });

      it('removes the callback after execution', ()=>{
        let ea = new EventAggregator();

        let callback = function(){};
        let subscription = ea.subscribe('dinner', callback);

        let callback2 = function(){};
        let subscription2 = ea.subscribe('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0]).toBe(callback);
        expect(ea.eventLookup.dinner[1]).toBe(callback2);

        subscription.dispose();

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback2);

        subscription2.dispose();
        expect(ea.eventLookup.dinner.length).toBe(0);
      });

      it('will respond to an event any time it is published', ()=>{
        let ea = new EventAggregator();
        let callback = function(){};
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
        let ea = new EventAggregator();
        let data = null;
        let callback = function(d){ data = d;};
        ea.subscribe('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0]).toBe(callback);

        ea.publish('dinner',{foo:"bar"});
        expect(data.foo).toBe("bar");
      });

    });

    describe('handler events', () =>{

      it('should not remove another handler when execute called twice', ()=>{
        let ea = new EventAggregator();
        let data = 0;

        let subscription = ea.subscribe(DinnerEvent, function() {});
        ea.subscribe(AnotherDinnerEvent, function() { data = 1; });

        subscription.dispose();
        subscription.dispose();

        ea.publish(new AnotherDinnerEvent(""));

        expect(data).toBe(1);
      });

      it('adds handler with messageType and callback to the messageHandlers array', ()=>{
        let ea = new EventAggregator();
        let callback = function(){};
        ea.subscribe(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        expect(ea.messageHandlers[0].messageType).toBe(DinnerEvent);
        expect(ea.messageHandlers[0].callback).toBe(callback);
      });

      it('removes the handler after execution', () =>{
        let ea = new EventAggregator();
        let callback = function(){};
        let subscription = ea.subscribe(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        subscription.dispose();
        expect(ea.messageHandlers.length).toBe(0);
      });

    });

  });

  describe('subscribeOnce', () =>{

    describe('string events', () =>{

      it('adds event with an anynomous function that will execute the callback to the eventLookup object', ()=>{
        let ea = new EventAggregator();
        let callback = function(){};
        ea.subscribeOnce('dinner', callback);

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);
      });

      it('adds multiple callbacks the same event', () =>{
        let ea = new EventAggregator();
        let callback = function(){};
        ea.subscribeOnce('dinner', callback);

        let callback2 = function(){};
        ea.subscribeOnce('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);
        expect(ea.eventLookup.dinner[1] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[1] === "function").toBe(true);
      });

      it('removes the callback after execution', ()=>{
        let ea = new EventAggregator();
        let callback = function(){};
        let subscription = ea.subscribeOnce('dinner', callback);

        let callback2 = function(){};
        let subscription2 = ea.subscribeOnce('dinner', callback2);

        expect(ea.eventLookup.dinner.length).toBe(2);
        expect(ea.eventLookup.dinner[0] === callback).toBe(false);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);
        expect(ea.eventLookup.dinner[1] === callback2).toBe(false);
        expect(typeof ea.eventLookup.dinner[1] === "function").toBe(true);

        subscription.dispose();

        expect(ea.eventLookup.dinner.length).toBe(1);
        expect(typeof ea.eventLookup.dinner[0] === "function").toBe(true);

        subscription2.dispose();
        expect(ea.eventLookup.dinner.length).toBe(0);
      });

      it('will respond to an event only once', ()=>{
        let ea = new EventAggregator();
        let data = null;

        let callback = function(){data = "something";};
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
        let ea = new EventAggregator();

        let data = null;
        let callback = function(d){data = d;};
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
        let ea = new EventAggregator();

        let callback = function(){};
        ea.subscribeOnce(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        expect(ea.messageHandlers[0].messageType).toBe(DinnerEvent);
        expect(ea.messageHandlers[0].callback === callback).toBe(false);
        expect(typeof ea.messageHandlers[0].callback === "function").toBe(true);

      });

      it('removes the handler after execution', () =>{
        let ea = new EventAggregator();
        let callback = function(){};
        let subscription = ea.subscribeOnce(DinnerEvent, callback);

        expect(ea.messageHandlers.length).toBe(1);
        subscription.dispose();
        expect(ea.messageHandlers.length).toBe(0);
      });

    });

  });

  describe('publish', () =>{

    describe('string events', () =>{

      it('calls the callback functions for the event', () =>{
        let ea = new EventAggregator();

        let someData, someData2;

        let callback = function(data){
          someData = data;
        };
        ea.subscribe('dinner', callback);

        let callback2 = function(data){
          someData2 = data;
        };
        ea.subscribe('dinner', callback2);

        let data = {foo: 'bar'};
        ea.publish('dinner', data);

        expect(someData).toBe(data);
        expect(someData2).toBe(data);
      });

      it('does not call the callback functions if subscriber does not exist', () =>{
        let ea = new EventAggregator();

        let someData;

        let callback = function(data){
          someData = data;
        };
        ea.subscribe('dinner', callback);

        ea.publish('garbage', {});

        expect(someData).toBeUndefined();
      });

      it('handles errors in subscriber callbacks', () => {
        let ea = new EventAggregator();

        let someMessage;

        let crash = function() {
          throw new Error('oops');
        }

        let callback = function(message){
          someMessage = message;
        };

        let data = {foo: 'bar'};

        ea.subscribe('dinner', crash);
        ea.subscribe('dinner', callback);
        ea.subscribe('dinner', crash);

        ea.publish('dinner', data);

        expect(someMessage).toBe(data);
      });

    });

    describe('handler events', () =>{

      it('calls the callback functions for the event', () =>{
        let ea = new EventAggregator();

        let someMessage;

        let callback = function(message){
          someMessage = message;
        };
        ea.subscribe(DinnerEvent, callback);

        let americanDinner = new DinnerEvent('Cajun chicken');
        ea.publish(americanDinner);

        expect(someMessage.message).toBe('Cajun chicken');

        let swedishDinner = new DinnerEvent('Meatballs');
        ea.publish(swedishDinner);

        expect(someMessage.message).toBe('Meatballs');
      });

      it('does not call the callback funtions if message is not an instance of the messageType', ()=>{
        let ea = new EventAggregator();

        let someMessage;

        let callback = function(message){
          someMessage = message;
        };
        ea.subscribe(DinnerEvent, callback);

        ea.publish(new DrinkingEvent());

        expect(someMessage).toBeUndefined();
      });


      it('handles errors in subscriber callbacks', () => {
        let ea = new EventAggregator();

        let someMessage;

        let crash = function() {
          throw new Error('oops');
        }

        let callback = function(message){
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
