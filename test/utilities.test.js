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

  describe('#isDirectory()', function () {
    var path = require('path');
    
    it('is a function with an arity of 1', function () {
      expect(typeof _.isDirectory).to.be('function');
      expect(_.isDirectory.length).to.be(1);
    });

    it('returns false if the file is not a directory', function () {
      var p = path.join(__dirname, 'images/bucket_a/circle@2x.png');
      expect(_.isDirectory(p)).to.be(false);
    });

    it('returns true if the file is a directory', function () {
      var p = path.join(__dirname, 'images/bucket_b');
      expect(_.isDirectory(p)).to.be(true);
    });
  });

  describe('#isImage()', function () {

    it('is a function with an arity of 1', function () {
      expect(typeof _.isImage).to.be('function');
      expect(_.isImage.length).to.be(1);
    });

    it('returns true for an acceptable image filename', function () {
      var files = ['image.jpeg', 'image.jpg', 'image.gif', 'image.png', 'image@2x.png', 'image-2x.png'];
      for (var i = 0, len = files.length; i < len; i++) {
        expect(_.isImage(files[i])).to.be(true);
      }
    });

    it('returns false for unacceptable image paths', function () {
      var files = ['images', '/images', 'images.', 'images.txt'];
      for (var i = 0, len = files.length; i < len; i++) {
        expect(_.isImage(files[i])).to.be(false);
      }
    });
  });

  describe('#isRetina()', function () {
    it('write a test for isRetina');
  });

  describe('#key()', function () {
    
    it('is a function with an arity of 1', function () {
      expect(typeof _.key).to.be('function');
      expect(_.key.length).to.be(1);
    });

    it('returns a string', function () {
      var key = _.key('/path/to/an/image.png');
      expect(key).to.be.ok();
      expect(typeof key).to.be('string');
    });

    it('normalizes a filename without extention or retina id', function () {
      expect(_.key('/path/to/an/image@2x.png')).to.eql('image');
      expect(_.key('/path/image-2x.png')).to.eql('image');
      expect(_.key('/path/image_2x.png')).to.eql('image');
      expect(_.key('/path/image.png')).to.eql('image');
    });
  });

  describe('#template()', function () {
    it('write a test for template');
  });
});
