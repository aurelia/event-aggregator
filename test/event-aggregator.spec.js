import {EventAggregator} from '../src/index';

describe('event aggregator', () => {
  
    describe('subscribe', () => {

  		describe('string events', () => {

		  	it('adds event with callback to the eventLookup object', () => {
		  		var ea = new EventAggregator();

		  		var callback = function(){};
		  		ea.subscribe('dinner', callback);

		  		expect(ea.eventLookup['dinner'].length).toBe(1);
		  		expect(ea.eventLookup['dinner'][0]).toBe(callback);
		  	});

		  	it('adds muliple callbacks the same event', () => {
		  		var ea = new EventAggregator();

		  		var callback = function(){};
		  		ea.subscribe('dinner', callback);

		  		var callback2 = function(){};
		  		ea.subscribe('dinner', callback2);

		  		expect(ea.eventLookup['dinner'].length).toBe(2);
		  		expect(ea.eventLookup['dinner'][0]).toBe(callback);
		  		expect(ea.eventLookup['dinner'][1]).toBe(callback2);
		  	});		  

		  	it('removes the callback after execution', ()=> {
		  		var ea = new EventAggregator();

		  		var callback = function(){};
		  		var executeMe = ea.subscribe('dinner', callback);

		  		var callback2 = function(){};
		  		ea.subscribe('dinner', callback2);

		  		expect(ea.eventLookup['dinner'].length).toBe(2);
		  		expect(ea.eventLookup['dinner'][0]).toBe(callback);
		  		expect(ea.eventLookup['dinner'][1]).toBe(callback2);

		  		executeMe();

		  		expect(ea.eventLookup['dinner'].length).toBe(1);
		  		expect(ea.eventLookup['dinner'][0]).toBe(callback2);
		  	});

		});

		describe('handler events', () => {

			it('adds handler with messageType and callback to the messageHandlers array', ()=> {
				var ea = new EventAggregator();
			
				var callback = function(){};
				ea.subscribe(DinnerEvent, callback);

				expect(ea.messageHandlers.length).toBe(1);
				expect(ea.messageHandlers[0].messageType).toBe(DinnerEvent);
				expect(ea.messageHandlers[0].callback).toBe(callback);
			});

			it('removes the handler after execution', () => {
				var ea = new EventAggregator();
		
				var callback = function(){};
				var executeMe = ea.subscribe(DinnerEvent, callback);

				expect(ea.messageHandlers.length).toBe(1);
				executeMe();
				expect(ea.messageHandlers.length).toBe(0);
			});

		});

  	});

	describe('publish', () => {

		describe('string events', () => {
			
			it('calls the callback functions for the event', () => {
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

		  		var data = { foo: 'bar' };
		  		ea.publish('dinner', data);

		  		expect(someData).toBe(data);
		  		expect(someData2).toBe(data);
			});

			it('does not call the callback functions if subscriber does not exist', () => {
				var ea = new EventAggregator();

				var someData;

		  		var callback = function(data){
		  			someData = data;
		  		};
		  		ea.subscribe('dinner', callback);		  		

		  		ea.publish('garbage', {});

		  		expect(someData).toBeUndefined();		  	
			});

		});

		describe('handler events', () => {

			it('calls the callback functions for the event', () => {
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

			it('does not call the callback funtions if message is not an instance of the messageType', ()=> {
				var ea = new EventAggregator();					

				var someMessage;

		  		var callback = function(message){
		  			someMessage = message;
		  		};		  		
				ea.subscribe(DinnerEvent, callback);			
			
		  		ea.publish(new DrinkingEvent());

		  		expect(someMessage).toBeUndefined();	
			});

		});

	});

});

class DinnerEvent{
	constructor(message){
		this._message = message;
	}

	get message(){
		return this._message;
	}
}

class DrinkingEvent{}