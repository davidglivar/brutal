/** @module {Function} lib/brutal **/

/**
 * Module dependencies
 */
var _ = require('./utilities')
  , fs = require('fs')
  , path = require('path');

/**
 * Private variables
 */
var _count = 0
  , _options = {
      margin: 0,
      output: process.cwd(),
      padding: 0,
      retinaSuffix: '@2x'
    };

/**
 * @namespace
 */
var brutal = module.exports;

/**
 * Completion callback for Group instances
 * @private
 * @this brutal
 * @param {[]Error} [errs=null] - Possible array of errors
 */
function _done(errs) {
  errs = errs || null;
  this._count++;
  if (errs.length) {
    for (var i = 0, l = errs.length; i < l; i++) {
      console.error('Error:', errs[i]);
    }
  }
  if (this._count === this.groups.length) {
    for (var i = 0, l = this.groups.length; i < l; i++) {
      this.map[this.groups[i].sheets.standard.key] = this.groups[i].sheets.standard.map;
    }
    this.map = JSON.stringify(this.map);
    fs.writeFile(path.join(brutal.output, 'brutalmap.json'), this.map, function (err) {
      if (err) console.error(err);
      console.log('BRUTALITY COMPLETE.');
    });
  }
}


/**
 * The brutal initialization function: merges default options with user options
 * and assigns valid options to `this`.
 * @public
 * @param {Object} [opts=_options] - Configuration options
 * @returns brutal
 */
brutal.init = function (opts) {
  opts = _.extend(_options, opts);

  this._count = 0;

  /**
   * Spritesheet pairs collection
   * @type {Array}
   */
  this.groups = [];

  /**
   * Coordinate/dimension map for spritesheets
   * @type {Object}
   */
  this.map = {};

  /**
   * Spacing around each sprite, does not affect sprite size (think css margin)
   * @type {number} [margin=0] 
   */
  this.margin = opts.margin;

  /**
   * The output directory for completed spritesheets
   * @type {string} [output=process.cwd()]
   */
  this.output = opts.output;

  /**
   * Spacing around each sprite, affects sprite size (think css padding)
   * @type {number} [padding=0]
   */
  this.padding = opts.padding;

  /**
   * The retina suffix to be used when writing finalized spritesheets
   * @type {string} [retinaSuffix='@2x']
   */
  this.retinaSuffix = opts.retinaSuffix;

  /**
   * List of validation errors
   * @type {Array}
   */
  this.validations = [];

  /**
   * Immutable constants
   */
  Object.defineProperty(this, 'MAX_AREA', {
    value: 2 * 1024 * 1024
  });

  return this;
};

/**
 * Flagship function, brutalizes images into spritesheets.
 * @public
 * @param {string} [src=process.cwd()] - Directory containing images to sprite
 */
brutal.run = function (src) {
  src = src || process.cwd();
  var containsImages = false
    , contents = fs.readdirSync(src)
    , done = _done.bind(this)
    , Group = require('./group');

  for (var i = 0, l = contents.length; i < l; i++) {
    var pth = path.join(src, contents[i]);
    if (_.isDirectory(pth)) {
      this.groups.push(new Group(pth));
    } else if (_.isImage(pth)) {
      containsImages = true;
    }
  }

  if (containsImages) this.groups.push(new Group(src));

  if (this.validations.length) {
    this.validations.forEach(function (msg) {
      console.log(msg);
    });
  }

  console.log('BRUTALIZING IMAGES...');
  for (var i = 0, l = this.groups.length; i < l; i++) {
    this.groups[i].draw().on('done', done);
  }
};

brutal.validation = function (msg) {
  this.validations.push(msg);
};
