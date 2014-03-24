var expect = require('expect.js')
  , brutal = require('../brutal');

describe('brutal', function () {
  
  it('is a function with an arity of 2', function () {
    expect(typeof brutal).to.be('function');
    expect(brutal.length).to.be(2);
  });
});
