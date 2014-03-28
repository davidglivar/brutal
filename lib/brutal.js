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
  , _groupsLen
  , _options = {
      output: process.cwd(),
      retinaSuffix: '@2x'
    };

/**
 * Completion callback for Group instances
 * @private
 * @param {[]Error} [errs=null] - Possible array of errors
 */
function _done(errs) {
  errs = errs || null;
  _count++;
  if (errs.length) {
    for (var i = 0, len = errs.length; i < len; i++) {
      console.error('Error:', errs[i]);
    }
  }
  if (_count === _groupsLen) {
    console.log('BRUTALITY COMPLETE.');
  }
}

var brutal = function (src) {
  src = src || process.cwd();

  this.validations = [];

  var containsImages = false
    , contents = fs.readdirSync(src)
    , Group = require('./group')
    , groups = []
    , len = contents.length
    , i = 0;

  for (i; i < len; i++) {
    var pth = path.join(src, contents[i]);
    if (_.isDirectory(pth)) {
      groups.push(new Group(pth));
    } else if (_.isImage(pth)) {
      containsImages = true;
    }
  }

  if (containsImages) groups.push(new Group(src));

  _groupsLen = groups.length;

  if (this.validations.length) {
    this.validations.forEach(function (msg) {
      console.log(msg);
    });
  }

  console.log('BRUTALIZING IMAGES...');

  groups.forEach(function (group) {
    group.draw().on('done', _done);
  });
};

brutal.init = function (opts) {
  opts = _.extend(_options, opts);

  this.output = opts.output;

  this.retinaSuffix = opts.retinaSuffix;

  return this;
};

brutal.validation = function (msg) {
  this.validations.push(msg);
};

exports = module.exports = brutal;
