/** @module {object} lib/utilities **/

/**
 * Module dependencies
 */
var path = require('path');

/**
 * @namespace _ - Alias for exports object
 * @exports lib/utilities
 */
var _ = exports;

/**
 * Merge an original object with any number of other objects
 * @param {object} original - The original object to be extended
 * @param {...object} [source] - The source objects to extend original
 * @returns {object} The extended object
 */
_.extend = function (original /*, ...source */) {
  var sources = Array.prototype.slice.call(arguments, 1)
    , len = sources.length
    , i = 0;
  for (i; i < len; i++) {
    for (var key in sources[i]) {
      if (sources[i].hasOwnProperty(key)) {
        original[key] = sources[i][key];
      }
    }
  }
  if (typeof original !== 'object') return {};
  return original;
};

/**
 * Creates a simplified key from a filename while detecting retina suffix
 * @param {string} pth - The string to key
 * @returns {object}
 */
_.key = function (pth) {
  var ext = path.extname(pth)
    , keyed = path.basename(pth, ext)
    , retina = false;
  keyed = keyed.replace(/(@|-|_)?2x/, function (m) {
    if (m) retina = true;
    return '';
  });
  return { key: keyed, retina: retina };
};
