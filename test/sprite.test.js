var expect = require('expect.js')
  , brutal = require('../brutal').init({ margin: 0, padding: 0 })
  , Sprite = require('../lib/sprite');

describe('Sprite', function () {
  
  it('is a function with an arity of 1', function () {
    expect(Sprite).to.be.a('function');
    expect(Sprite.length).to.be(1);
  });

  it('augments EventEmitter', function () {
    var s = new Sprite('./test/images/bucket_a/circle.png');
    expect(s.on).to.be.a('function');
    expect(s.emit).to.be.a('function');
  });

  describe('STYLE_TEMPLATE', function () {

    it('is immutable', function () {
      var value = Sprite.STYLE_TEMPLATE;
      Sprite.STYLE_TEMPLATE = 'test';
      expect(Sprite.STYLE_TEMPLATE).to.be(value);
    });
  });

  describe('VALIDATION_MESSAGE', function () {
    
    it('is immutable', function () {
      var value = Sprite.VALIDATION_MESSAGE;
      Sprite.VALIDATION_MESSAGE = 'test';
      expect(Sprite.VALIDATION_MESSAGE).to.be(value);
    });
  });

  describe('#stylize()', function () {

    it('is a function with an arity of 1', function () {
      expect(Sprite.prototype.stylize).to.be.a('function');
      expect(Sprite.prototype.stylize.length).to.be(1);
    });

    it('sets the value of a Sprite instances\' "style" value', function () {
      var s = new Sprite('./test/images/bucket_a/circle.png')
        , value = s.style;
      s.stylize('/a/url');
      expect(s.style).to.not.be(value);
    });
  });

  describe('#validate()', function () {
    
    it('is a function', function () {
      expect(Sprite.prototype.validate).to.be.a('function');
    });

    it('does not create a validation message for a standard image', function () {
      var len = brutal.validations.length
        , s = new Sprite('./test/images/invalid/circle.png');
      expect(brutal.validations.length).to.be(len);
    });

    it('does not create a validation message for a retina image with even dimensions', function () {
      var len = brutal.validations.length
        , s = new Sprite('./test/images/bucket_a/circle@2x.png');
      expect(brutal.validations.length).to.be(len);
    });

    it('creates a validation message for a retina image with odd dimensions', function () {
      var len = brutal.validations.length
        , s = new Sprite('./test/images/invalid/circle@2x.png');
      expect(brutal.validations.length).to.be(len+1);
    });
  });
});
