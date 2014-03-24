/** @module {object} lib/utilities **/

/**
 * @namespace _ - Alias for exports object
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
