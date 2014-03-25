/** @module {Function} lib/base **/

/**
 * Module dependencies
 */
var EventEmitter = require('events').EventEmitter
  , _ = require('./utilities');

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
