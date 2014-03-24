/** @module {Function} lib/sprite **/

/**
 * Module dependencies
 */
var Base = require('./base')
  , util = require('util');

/**
 * Models an image to be used within a spritesheet
 * @constructor
 * @augments Base
 */
function Sprite() {
  Base.call(this);
}

util.inherits(Sprite, Base);

exports = module.exports = Sprite;
