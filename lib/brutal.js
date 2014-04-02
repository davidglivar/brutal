/** @module {Function} lib/brutal **/

/**
 * Module dependencies
 */
var _ = require('./utilities')
  , fs = require('fs')
  , path = require('path')
  , util = require('util');

/**
 * Private variables
 */
var _options = {
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
  var self = this;
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
      console.log('BRUTALITY COMPLETE.', (new Date() - self._starttime) + 'ms');
      process.exit();
    });
  }
}

function _validationCB() {
  var done = _done.bind(this)
  console.log('BRUTALIZING IMAGES...');
  this._starttime = new Date();
  for (var i = 0, l = this.groups.length; i < l; i++) {
    this.groups[i].draw().on('done', done);
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
  this._starttime = null;

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
    value: 3 * 1024 * 1024
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
  var self = this
    , containsImages = false
    , contents = fs.readdirSync(src)
    , Group = require('./group')
    , validationCB = _validationCB.bind(this);

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

    console.log('Validation errors were found, press enter to continue or "no" to abort.');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (response) {
      response = util.inspect(response);
      if (/^'\\n'$/.test(response)) {
        validationCB();
      } else {
        console.log('aborting.');
        process.exit(1);
      }
    });
  } else {
    validationCB();
  }
};

brutal.validation = function (msg) {
  this.validations.push(msg);
};
