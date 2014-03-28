/** @module {Function} lib/sprite **/

/**
 * Module dependencies
 */
var _ = require('./utilities')
  , brutal = require('./brutal')
  , EventEmitter = require('events').EventEmitter
  , sizeOf = require('image-size')
  , util = require('util');

/**
 * Models an image to be used within a spritesheet
 * @constructor
 * @augments EventEmitter
 * @param {string} pth - The path to the image
 */
function Sprite(pth) {
  EventEmitter.call(this);

  var dimensions = sizeOf(pth);

  this.height = dimensions.height;

  this.img = null;

  this.key = _.key(pth);

  this.path = pth;

  this.retina = _.isRetina(this.path);

  this.width = dimensions.width;

  this.x = 0;

  this.y = 0;

  this.validate();
}

util.inherits(Sprite, EventEmitter);

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
