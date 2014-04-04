var expect = require('expect.js')
  , packer = require('../lib/packer');

describe('packer', function () {
  
  xit('packs images', function () {
    var sprites = [
      { width: 100, height: 100 },
      { width: 100, height: 100 },
      { width: 80, height: 80 },
      { width: 80, height: 80 }
    ];
    packer.pack(sprites);
  });
});
