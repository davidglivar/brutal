/** @module {Function} lib/sprite **/

var _ = require('./utilities')
  , Base = require('./base')
  , brutal = require('./brutal')
  , sizeOf = require('image-size')
  , util = require('util');

/**
 * Models an image to be used within a spritesheet
 * @constructor
 * @augments Base
 * @param {string} pth - The path to the image
 */
function Sprite(pth) {
  Base.call(this, pth);

  var keyed = _.key(this.path)
    , dimensions = sizeOf(this.path);

  this.height = dimensions.height;

  this.img = null;

  this.key = _.key(this.path);

  this.retina = _.isRetina(this.path);

  this.width = dimensions.width;

  this.x = 0;

  this.y = 0;

  this.validate();
}

util.inherits(Sprite, Base);

Sprite.prototype.validate = function () {
  if (!this.retina) return true;
  if (this.width % 2 !== 0 || this.height % 2 !== 0) {
    brutal.validation(
      'Retina sprite has odd dimensions, this will cause problems'
    );
    return false;
  }
  return true;
};

exports = module.exports = Sprite;
