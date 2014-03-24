/** @module {Function} lib/base **/

/**
 * Module dependencies
 */
var EventEmitter = require('events').EventEmitter;

/**
 * Base image constructor
 * @constructor
 */
function Base() {

  this.events = new EventEmitter();

  this.height = 0;

  this.width = 0;
}

exports = module.exports = Base;
