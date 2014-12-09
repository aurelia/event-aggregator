import {EventAggregator} from '../lib/index';

describe('event aggregator', () => {
  it('should have some tests', () => {
    var ea = new EventAggregator();
    expect(ea).toBe(ea);
  });
});