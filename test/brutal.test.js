var expect = require('expect.js')
  , brutal = require('../brutal');

describe('brutal', function () {
  
  it('is an object', function () {
    expect(brutal).to.be.ok();
    expect(typeof brutal).to.be('object');
  });

  it('exposes init, run, and validation methods', function () {
    expect(brutal.init).to.be.ok();
    expect(brutal.run).to.be.ok();
    expect(brutal.validation).to.be.ok();
  });

  describe('MAX_AREA', function () {
    
    it('is a number', function () {
      expect(brutal.MAX_AREA).to.be.a('number');
    });

    it('is 3 megapixels', function () {
      expect(brutal.MAX_AREA).to.be(3145728);
    });
  });

  describe('#init()', function () {

    it('injects options into brutal', function () {
      brutal.init();
      var margin = brutal.margin
        , output = brutal.output
        , padding = brutal.padding
        , retinaSuffix = brutal.retinaSuffix;
      brutal.init({
        margin: 2,
        padding: 3,
        output: 'some/path',
        retinaSuffix: '-2x'
      });
      expect(brutal.margin).to.not.eql(margin);
      expect(brutal.margin).to.be(2);
      expect(brutal.padding).to.not.eql(padding);
      expect(brutal.padding).to.be(3);
      expect(brutal.output).to.not.eql(output);
      expect(brutal.output).to.be('some/path');
      expect(brutal.retinaSuffix).to.not.be(retinaSuffix);
      expect(brutal.retinaSuffix).to.be('-2x');
    });
  });

  describe('#run()', function () {
    it('write tests for #run()');
  });

  describe('#validation()', function () {
    beforeEach(function () { brutal.init(); });
    
    it('adds a message into the validation queue', function () {
      var len = brutal.validations.length;
      brutal.validation('a message');
      expect(brutal.validations.length).to.be(len+1);
    });
  });
});
