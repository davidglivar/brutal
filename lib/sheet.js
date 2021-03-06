/** @module {Function} lib/sheet **/

/**
 * Module dependencies
 */
var _ = require('./utilities')
  , brutal = require('./brutal')
  , child_process = require('child_process')
  , debug = require('debug')
  , EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , ndarray = require('ndarray')
  , Packer = require('./packer')
  , path = require('path')
  , savePixels = require('save-pixels')
  , TmpFile = require('temporary/lib/file')
  , util = require('util');

/**
 * Private variables
 */
var _drawjs = path.join(__dirname, '/phantom/draw.js')
  , _debug_draw = debug('sheet:draw')
  , _debug_sort = debug('sheet:sort')
  , _debug_validate = debug('sheet:validate');

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

  this.output_url = null;

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
  this.sprites = null;

  this.suffix = this.retina ? brutal.retinaSuffix : '';

  /**
   * The width of the sheet
   * @type {number}
   */
  this.width = 0;

  this.output_url = path.join(brutal.output, this.key + this.suffix + '.png');

  _debug_sort('%s packing...', this.key + this.suffix);

  var clones = [sprites.slice(0), sprites.slice(0), sprites.slice(0)];

  var sorts = [
        (new Packer()).pack(clones[0], 'area')//,
        //(new Packer()).pack(clones[1], 'width'),
        //(new Packer()).pack(clones[2], 'height')
      ]
    , best = sorts.sort(function (a, b) { return a.area - b.area; }).shift();
  console.log(best.method);
  this.sprites = best.sprites;
  this.width = best.width;
  this.height = best.height;
  _debug_sort('%s packing:complete.', this.key + this.suffix);
  this.validate();
}

util.inherits(Sheet, EventEmitter);

Object.defineProperty(Sheet, 'VALIDATION_MESSAGE', {
  value: 'WARNING: Sheet {{key}}\n'
       + '  {{msg}}\n'
});

Sheet.prototype.draw = function () {
  _debug_draw('%s phantom:starting...', this.key+this.suffix);
  var self = this
    , tmp = new TmpFile()
    , params = encodeURIComponent(JSON.stringify({
        height: self.height,
        sprites: self.sprites,
        width: self.width,
        tmp: tmp.path
      }))
    , phantom = child_process.spawn('phantomjs', [_drawjs, params]);
  phantom.stderr.on('data', function (buf) {
    var msg = buf.toString();
    if (!/phantom/.test(msg)) console.log(msg);
  });
  phantom.on('close', function () {
    _debug_draw('%s phantom:close', self.key+self.suffix);
    _debug_draw('%s png:pipe', self.key+self.suffix);
    tmp.readFile(function (err, data) {
      if (err) {
        console.error(err);
        return phantom.exit(1);
      }
      var ndarr = ndarray(JSON.parse(data.toString()),
                          [self.height, self.width, 4],
                          [4 * self.width, 4, 1], 0)
        , ws = fs.createWriteStream(self.output_url)
        , png = savePixels(ndarr, 'PNG');
      tmp.unlink();
      png.pipe(ws);
      png.on('end', self.write.bind(self));
    });
  });
  return this;
};

Sheet.prototype.validate = function () {
  _debug_validate('%s starting...', this.key+this.suffix);
  var area = this.width * this.height;
  if (area >= brutal.MAX_AREA) {
    var self = this;
    brutal.validation(_.template(Sheet.VALIDATION_MESSAGE, {
      key: self.key + self.suffix,
      msg: 'Exceeds maximum area allowed for image.'
    }));
  }
  _debug_validate('%s complete.', this.key+this.suffix);
};

// TODO: think of a better method name
Sheet.prototype.write = function (err) {
  _debug_draw('%s png:complete', this.key+this.suffix);
  var done = _done.bind(this);
  if (this.retina) return done(err);
  for (var i = 0, l = this.sprites.length; i < l; i++) {
    this.map[this.sprites[i].key] = {
      x: this.sprites[i].x,
      y: this.sprites[i].y,
      width: this.sprites[i].width,
      height: this.sprites[i].height
    };
  }
  return done(err);
};

module.exports = Sheet;
