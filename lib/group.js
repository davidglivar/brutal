/** @module {Function} lib/group **/

var _ = require('./utilities')
  , brutal = require('./brutal')
  , EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , path = require('path')
  , Sheet = require('./sheet')
  , Sprite = require('./sprite')
  , util = require('util');

/**
 * Filter images into standard and retina buckets
 * @private
 * @param {Array} images - The array of images to sort
 * @returns {Object}
 */
function filterImages(images) {
  var filtered = { standard: [], retina: [] }
    , i = 0
    , len = images.length;
  for (i; i < len; i++) {
    var sprite = new Sprite(images[i])
      , key = sprite.retina ? 'retina' : 'standard';
    filtered[key].push(sprite);
  }
  return filtered;
}

/**
 * Loop directory and return all images found
 * @private
 * @param {string} pth - The full path to a directory containing images
 * @returns {Array}
 */
function getImages(pth) {
  var files = fs.readdirSync(pth)
    , len = files.length
    , i = 0
    , images = [];
  for (i; i < len; i++) {
    var file = path.join(pth, files[i]);
    // TODO: recursive brutal call?
    if (_.isDirectory(file)) continue;
    if (_.isImage(file)) images.push(file);
  }
  return images;
}

/**
 * Models a directory containing images, with a pair of Sheet instances that
 * share the same key.
 * @constructor
 * @param {string} pth - The full path to a directory containing images
 */
function Group(pth) {
  EventEmitter.call(this);

  /**
   * All image files contained in this Group's directory
   * @type {Array}
   */
  this.files = getImages(pth);

  /**
   * The images files split into two buckets: standard and retina
   * @type {Object}
   * @property {Array} this.filtered.standard - Standard images
   * @property {Array} this.filtered.retina   - Retina images
   */
  this.filtered = filterImages(this.files);
  
  /**
   * The full path to this Group's directory
   * @type {string}
   */
  this.path = pth;

  /**
   * The pair of Sheets for this Group instance
   * @type {Object}
   * @property {Sheet} this.sheets.standard - Standard Sheet
   * @property {Sheet} this.sheets.retina   - Retina Sheet
   */
  this.sheets = {
    standard: new Sheet(this.path, this.filtered.standard, false),
    retina: new Sheet(this.path, this.filtered.retina, true)
  };
}

util.inherits(Group, EventEmitter);

Group.prototype.draw = function () {
  var self = this
    , count = 0
    , errs = []
    , done = function (err) {
        count++;
        if (err) {
          errs.push(err);
        }
        if (count === 2) {
          self.emit('done', errs);
        }
      };
  this.sheets.standard.draw().events.on('done', done);
  this.sheets.retina.draw().events.on('done', done);
  return this;
};

Group.prototype.validate = function () {
  var len = this.files.length
    , i = 0;
  if (len % 2 !== 0) {
    brutal.validation(
      'You have an odd number of images in the following directory: '+this.path
    );
  }
  // compare related sprite dimensions
  //for (i; i < len; i++) {
    
  //}
};

exports = module.exports = Group;
