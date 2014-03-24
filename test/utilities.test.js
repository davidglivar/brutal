var expect = require('expect.js')
  , _ = require('../lib/utilities');

describe('utilities', function () {
  
  it('is exported as an object', function () {
    expect(typeof _).to.be('object');
  });

  describe('#extend()', function () {
    
    it('is a function with an arity of 1', function () {
      expect(typeof _.extend).to.be('function');
      expect(_.extend.length).to.be(1);
    });

    it('returns an object', function () {
      var obj = _.extend({});
      expect(typeof obj).to.be('object');
    });

    it('merges properties from a source object into the original', function () {
      var obj = { name: 'brutal' };
      _.extend(obj, { desc: 'a spriting tool' });
      expect(obj.name).to.be.ok();
      expect(obj.desc).to.be.ok();
    });

    it('merges properties from multiple source objects into the original', function () {
      var obj = { name: 'brutal' };
      _.extend(obj, { desc: 'a spriting tool' }, { foo: true });
      expect(obj.name).to.be.ok();
      expect(obj.desc).to.be.ok();
      expect(obj.foo).to.be.ok();
    });
  });
});
