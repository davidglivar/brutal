/** @module {Function} lib/base **/

var _ = require('./utilities')
  , EventEmitter = require('events').EventEmitter;

/**
 * Base image constructor
 * @constructor
 * @param {string} pth - The path to the image
 */
function Base(pth) {

  this.events = new EventEmitter();

  this.path = pth;
}

exports = module.exports = Base;
