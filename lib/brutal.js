/** @module {Function} lib/brutal **/

var _ = require('./utilities')
  , fs = require('fs')
  , path = require('path')
  , _options = {
      output: process.cwd(),
      retinaSuffix: '@2x'
    };

var brutal = function (src) {
  src = src || process.cwd();

  this.validations = [];

  var containsImages = false
    , contents = fs.readdirSync(src)
    , Group = require('./group')
    , groups = []
    , len = contents.length
    , i = 0
    , count = 0
    , done = function (errs) {
        count++;
        if (errs.length) {
          errs.forEach(function (err) {
            console.error('Error:', err);
          });
        }
        if (count === groups.length) {
          console.log('BRUTALITY COMPLETE.');
        }
      };

  for (i; i < len; i++) {
    var pth = path.join(src, contents[i]);
    if (_.isDirectory(pth)) {
      groups.push(new Group(pth));
    } else if (_.isImage(pth)) {
      containsImages = true;
    }
  }

  if (containsImages) groups.push(new Group(src));

  if (this.validations.length) {
    this.validations.forEach(function (msg) {
      console.log(msg);
    });
  }

  console.log('BRUTALIZING IMAGES...');

  groups.forEach(function (group) {
    group.draw().on('done', done);
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
