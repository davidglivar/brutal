/** @module {Function} lib/sheet **/

/**
 * Module dependencies
 */
var Base = require('./base')
  , util = require('util');

/**
 * Models an image containing many sprites (aka: a spritesheet)
 * @constructor
 * @augments Base
 */
function Sheet() {
  Base.call(this);
}

util.inherits(Sheet, Base);

exports = module.exports = Sheet;
