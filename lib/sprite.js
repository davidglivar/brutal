/** @module {Function} lib/sprite **/

/**
 * Module dependencies
 */
var Base = require('./base')
  , _ = require('./utilities')
  , util = require('util');

/**
 * Models an image to be used within a spritesheet
 * @constructor
 * @augments Base
 * @param {string} pth - The path to the image
 */
function Sprite(pth) {
  Base.call(this, pth);

  var keyed = _.key(this.path);

  this.height = 0;

  this.key = keyed.key;

  this.retina = keyed.retina;

  this.width = 0;
}

util.inherits(Sprite, Base);

exports = module.exports = Sprite;
