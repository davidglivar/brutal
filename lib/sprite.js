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

  var dimensions = sizeOf(pth)
    , isRetina = _.isRetina(pth)
    , mod = isRetina ? 2 : 1;

  Object.defineProperties(this, {

    /**
     * The height of this sprite with margin/padding
     * @type {number}
     */
    height: {
      get: function height() { return this.__height; },
      set: function height(v) {
        this.__naturalHeight = v;
        this.__height = v + ((brutal.padding * mod + brutal.margin * mod) * 2);
      }
    },

    /**
     * The width of this sprite with margin/padding
     * @type {number}
     */
    width: {
      get: function width() { return this.__width; },
      set: function width(v) {
        this.__naturalWidth = v;
        this.__width = v + ((brutal.padding * mod + brutal.margin * mod) * 2);
      }
    },

    /**
     * The x coordinate of this sprite in its parent sheet
     * @type {number}
     */
    x: {
      get: function x() { return this.__x; },
      set: function x(v) {
        this.__x = v + brutal.padding * mod + brutal.margin * mod;
      }
    },

    /**
     * The y coordinate of this sprite in its parent sheet
     * @type {number}
     */
    y: {
      get: function y() { return this.__y; },
      set: function y(v) {
        this.__y = v + brutal.padding * mod + brutal.margin * mod;
      }
    },

    /**
     * CSS properties
     * @type {string}
     */
    style: {
      get: function style() { return this.__style; },
      set: function style(url) {
        this.__style = _.template(Sprite.STYLE_TEMPLATE, {
          classname: '.icon-' + this.key,
          url: url,
          x: this.x > 0 ? -this.x : 0,
          y: this.y > 0 ? -this.y : 0,
          height: this.height,
          width: this.width
        });
      }
    }
  });

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
  this.retina = isRetina;

  this.height = dimensions.height;
  this.width = dimensions.width;
  this.x = 0;
  this.y = 0;
  this.validate();
}

util.inherits(Sprite, EventEmitter);

Object.defineProperties(Sprite, {

  /**
   * @static
   * @constant
   */
  STYLE_TEMPLATE: {
    value: '{{classname}} {\n'
         + '  background-image: url({{url}});\n'
         + '  background-position: {{x}}px {{y}}px;\n'
         + '  height: {{height}}px;\n'
         + '  width: {{width}}px;\n'
         + '}'
  },

  /**
   * @static
   * @constant
   */
  VALIDATION_MESSAGE: {
    value: 'WARNING: Sprite {{key}}\n'
         + '  {{msg}}\n'
  }
});

Sprite.prototype.validate = function () {
  var self = this;
  if (this.retina && (this.width % 2 !== 0 || this.height % 2 !== 0)) {
    brutal.validation(_.template(Sprite.VALIDATION_MESSAGE, {
      key: self.key,
      msg: 'Retina sprite has odd dimensions, this will cause problems'
    }));
  }
};

module.exports = Sprite;
