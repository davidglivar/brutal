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

  /**
   * The native height of the sprite
   * @type {number}
   */
  this.height = dimensions.height + brutal.padding;

  /**
   * TODO: why does phantom need this?
   */
  this.img = null;

  /**
   * The unique key for this sprite
   * @type {string}
   */
  this.key = _.key(pth);

  /**
   * The full path to this image
   * @type {string}
   */
  this.path = pth;

  /**
   * Declares if this sprite is for retina
   * @type {boolean}
   */
  this.retina = _.isRetina(this.path);

  /**
   * The native width of the sprite
   * @type {number}
   */
  this.width = dimensions.width + brutal.padding * 2;

  /**
   * The x coordinate of this sprite in its parent sheet
   * @type {number}
   */
  this.x = 0 + brutal.padding;

  /**
   * The y coordinate of this sprite in its parent sheet
   * @type {number}
   */
  this.y = 0;

  this.style = null;

  this.validate();
}

util.inherits(Sprite, EventEmitter);

/**
 * Immutable constant on Sprite
 * @static
 */
Object.defineProperty(Sprite, 'STYLE_TEMPLATE', {
  value: '{{classname}} {\n'
       + '  background-image: url({{url}});\n'
       + '  background-position: {{x}}px {{y}}px;\n'
       + '  height: {{height}}px;\n'
       + '  width: {{width}}px;\n'
       + '}'
});

Sprite.prototype.stylize = function (url) {
  this.style = _.template(Sprite.STYLE_TEMPLATE, {
    classname: '.icon-' + this.key,
    url: url,
    x: this.x > 0 ? -this.x : 0,
    y: this.y > 0 ? -this.y : 0,
    height: this.height,
    width: this.width
  });
};

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
