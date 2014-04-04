var lib = process.env.BRUTAL_COV ? 'lib-cov' : 'lib';

var expect = require('expect.js')
  , _ = require('../'+lib+'/utilities')
  , brutal = require('../brutal')
  , Group = require('../'+lib+'/group');

describe('Group', function () {
  
  it('is a function with an arity of 1', function () {
    expect(Group).to.be.a('function');
    expect(Group.length).to.be(1);
  });

  it('augments EventEmitter', function () {
    var g = new Group('./test/images/bucket_a');
    expect(g.on).to.be.a('function');
    expect(g.emit).to.be.a('function');
  });

  describe('VALIDATION_MESSAGE', function () {
    
    it('is immutable', function () {
      var value = Group.VALIDATION_MESSAGE;
      Group.VALIDATION_MESSAGE = 'test';
      expect(Group.VALIDATION_MESSAGE).to.be(value);
    });
  });

  describe('#draw()', function () {
    it('write a test');
  });

  describe('#validate()', function () {
    
    it('is a function', function () {
      expect(Group.prototype.validate).to.be.a('function');
    });

    it('passes with a directory containing an even number of images', function () {
      var len = brutal.validations.length
        , g = new Group('./test/images/bucket_a');
      expect(brutal.validations.length).to.be(len);
    });

    it('fails with a directory containing an odd number of images', function () {
      var len = brutal.validations.length
        , g = new Group('./test/images/bucket_a');
      g.files.pop();
      g.validate();
      expect(brutal.validations.length).to.be(len+1);
    });

    it('passes with a directory containing matching sprites', function () {
      var len = brutal.validations.length
        , g = new Group('./test/images/bucket_a');
      expect(brutal.validations.length).to.be(len);
    });

    it('fails with a directory containing mismatched sprites', function () {
      var len = brutal.validations.length
        , g = new Group('./test/images/invalid')
        , msg = _.template(Group.VALIDATION_MESSAGE, {
            key: g.sheets.standard.key,
            msg: 'Sprite pair with key "'+g.sheets.standard.sprites[0].key+'" do not match'
          });
      expect(brutal.validations.indexOf(msg)).to.not.be(-1);
    });
  });
});
