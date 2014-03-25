/** @module {Function} lib/brutal **/

/**
 * Module dependencies
 */
var fs = require('fs')
  , path = require('path')

  , join = path.join

  , Group = require('./group')
  , _ = require('./utilities')

  , _groups = [];

/**
 * The main entry point for brutal
 * @exports lib/brutal
 * @param {string} src - The directory path containing images to be joined
 * @param {object} [opts] - Various spriting options
 */
function brutal(src, opts) {
  src = src || process.cwd();
  opts = _.extend({}, opts);

  var contents = fs.readdirSync(src)
    , len = contents.length
    , i = 0
    , switched = false;

  for (i; i < len; i++) {
    var pth = join(src, contents[i])
      , stats = fs.statSync(pth)
      , isDir = stats.isDirectory();
    if (isDir) {
      _groups.push(new Group(pth));
    } else if (!isDir && !switched) {
      switched = true;
      _groups.push(new Group(src));
    }
  }
}

exports = module.exports = brutal;

/**
 * @ignore
 */
brutal(path.join(__dirname, '../test/images'));
