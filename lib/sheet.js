/** @module {Function} lib/sheet **/

/**
 * Module dependencies
 */
var _ = require('./utilities')
  , brutal = require('./brutal')
  , child_process = require('child_process')
  , EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , ndarray = require('ndarray')
  , path = require('path')
  , savePixels = require('save-pixels')
  , util = require('util');

/**
 * Private variables
 */
var _drawjs = path.join(__dirname, '/phantom/draw.js');

/**
 * Sheet draw completion callback
 * @private
 * @this Sheet
 * @param {Error} [err=null] - Possible error
 */
function _done(err) {
  err = err || null;
  this.emit('done', err);
}

/**
 * Models an image containing many sprites (aka: a spritesheet)
 * @constructor
 * @augments EventEmitter
 * @param {string} pth - The path to this sheets representative directory
 * @param {Array} sprites - An array of Sprite instances
 * @param {boolean} retina - If this is a retina sheet
 */
function Sheet(pth, sprites, retina) {
  EventEmitter.call(this);

  /**
   * Raw pixel buffer
   * @type {Buffer}
   */
  this.buffer = new Buffer(0);

  /**
   * The height of the sheet
   * @type {number}
   */
  this.height = 0;

  /**
   * The unique key for this sheet
   * @type {string}
   */
  this.key = _.key(pth);

  this.map = {};

  /**
   * The full path to this sheets representative directory
   * @type {string}
   */
  this.path = pth;

  /**
   * Declares if this sheet is for retina
   * @type {boolean}
   */
  this.retina = retina;

  /**
   * The sprites to be used for this sheet
   * @type {Array}
   */
  this.sprites = sprites;

  /**
   * The width of the sheet
   * @type {number}
   */
  this.width = 0;

  // basic alpha-top-down sort
  for (var i = 0, len = this.sprites.length; i < len; i++) {
    this.sprites[i].y = this.height + brutal.padding;
    this.height += this.sprites[i].height + brutal.padding;
    if (this.sprites[i].width > this.width) {
      this.width = this.sprites[i].width;
    }
  }
}

util.inherits(Sheet, EventEmitter);

Sheet.prototype.draw = function () {
  var self = this
    , params = encodeURIComponent(JSON.stringify({
        height: self.height,
        sprites: self.sprites,
        width: self.width
      }))
    , phantom = child_process.spawn('phantomjs', [_drawjs, params]);
  phantom.stdout.on('data', function (buffer) {
    self.buffer = Buffer.concat([self.buffer, buffer]);
  });
  phantom.on('close', function () {
    var ndarr = ndarray(JSON.parse(self.buffer.toString()), 
                        [self.height, self.width, 4], 
                        [4 * self.width, 4, 1], 0)
      , suffix = self.retina ? brutal.retinaSuffix : ''
      , ws = fs.createWriteStream(path.join(brutal.output, self.key + suffix + '.png'))
      , png = savePixels(ndarr, 'PNG');
    png.pipe(ws);
    png.on('end', self.write.bind(self));
  });
  return this;
};

Sheet.prototype.write = function (err) {
  var done = _done.bind(this);
  if (this.retina) return done(err);
  for (var i = 0, l = this.sprites.length; i < l; i++) {
    this.map[this.sprites[i].key] = {
      x: this.sprites[i].x,
      y: this.sprites[i].y,
      width: this.sprites[i].width,
      height: this.sprites[i].height
    }
  }
  return done(err);
};

exports = module.exports = Sheet;
