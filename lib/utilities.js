/** @module {object} lib/utilities **/

var fs = require('fs')
  , path = require('path');

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
 * Helper for fs stats isDirectory method
 * @param {string} pth - The path to test
 * @returns {bool}
 */
_.isDirectory = function (pth) {
  return fs.statSync(pth).isDirectory();
};

/**
 * Checks if filename includes an accepted image extenstion
 * @param {string} filename - The filename to test
 * @returns {bool}
 */
_.isImage = function (filename) {
  return /\.(jpeg|jpg|gif|png)$/.test(filename);
};

_.isRetina = function (pth) {
  return /(@|-|_)?2x/.test(pth);
};

/**
 * Creates a simplified key from a filename while detecting retina suffix
 * @param {string} pth - The string to key
 * @returns {string}
 */
_.key = function (pth) {
  var ext = path.extname(pth)
    , keyed = path.basename(pth, ext);
  return keyed.replace(/(@|-|_)?2x/, '');
};

/**
 * Parses a given template and map into a completed string
 * @example
 *  var template = '<div>{{name.first}} {{name.last}}, {{age}}</div>';
 *  var map = {
 *    name: { first: 'David', last: 'Glivar' },
 *    age: 29
 *  };
 *  var view = _.template(template, map);
 * @param {string} t - The unparsed template to use
 * @param {Object} map - A map of values to place into the template
 * @returns {string}
 */
_.template = function (t, map) {
  map = map || {};
  var reg = /\{{2}(\w+\.?)+?\}{2}/g
    , matches = t.match(reg)
    , keymap = {}
    , items
    , helper = function () {
        var value = map[items[0]];
        if (items.length > 1) {
          for (var i = 0, l = items.length; i < l; i++) {
            value = value[items[i]];
          }
        }
        return value;
      };
  if (!matches) return t;
  for (var i = 0, l = matches.length; i < l; i++) {
    keymap[matches[i]] = matches[i].replace(/(^\{{2}|\}{2}$)/g, '').split('.');
  }
  for (var key in keymap) {
    items = keymap[key];
    t = t.replace(new RegExp(key, 'g'), helper);
  }
  return t;
};
