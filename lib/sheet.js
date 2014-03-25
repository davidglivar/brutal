/** @module {Function} lib/sheet **/

/**
 * Module dependencies
 */
var Base = require('./base')
  , Sprite = require('./sprite')
  , _ = require('./utilities')
  , util = require('util');

/**
 * Models an image containing many sprites (aka: a spritesheet)
 * @constructor
 * @augments Base
 * @param {string} pth - The path to the image
 */
function Sheet(pth) {
  Base.call(this, pth);

  this.key = _.key(this.path).key;
}

util.inherits(Sheet, Base);

exports = module.exports = Sheet;
