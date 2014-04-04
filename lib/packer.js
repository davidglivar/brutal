/** @module {Object} lib/packer **/

/**
 * Module dependencies
 */
var _ = require('./utilities');

var PackerNode = function (props) {
  props = _.extend({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    used: false,
    down: null,
    right: null
  }, props);

  this.x = props.x;
  this.y = props.y;
  this.width = props.width;
  this.height = props.height;
  this.used = props.used;
  this.down = props.down;
  this.right = props.right;
};

var Packer = function () {
  this.root = new PackerNode();
};

Packer.prototype.pack = function (sprites, sortprop) {
  sprites = sprites.sort(function (a, b) {
    return b[sortprop] - a[sortprop];
  });
  var len = sprites.length
    , i = 0
    , w = len > 0 ? sprites[0].width : 0
    , h = len > 0 ? sprites[0].height : 0
    , node;
  this.root.width = w;
  this.root.height = h;
  for (i; i < len; i++) {
    var fit;
    if (node = this.findNode(this.root, sprites[i].width, sprites[i].height)) {
      fit = this.splitNode(node, sprites[i].width, sprites[i].height);
    } else {
      fit = this.growNode(sprites[i].width, sprites[i].height);
    }
    sprites[i].x = fit.x;
    sprites[i].y = fit.y;
  }
  return {
    method: sortprop,
    area: this.root.width * this.root.height,
    sprites: sprites,
    width: this.root.width,
    height: this.root.height
  };
};

Packer.prototype.findNode = function (root, width, height) {
  if (root.used) {
    return this.findNode(root.right, width, height) 
        || this.findNode(root.down, width, height);
  } else if (width <= root.width && height <= root.height) {
    return root;
  }
  return null;
};

Packer.prototype.splitNode = function (node, width, height) {
  node.used = true;
  node.down = {
    x: node.x,
    y: node.y + height,
    width: node.width,
    height: node.height - height
  };
  node.right = {
    x: node.x + width,
    y: node.y,
    width: node.width - width,
    height: height
  };
  return node;
};

Packer.prototype.growNode = function (width, height) {
  var canGrowDown = width <= this.root.width
    , canGrowRight = height <= this.root.height
    , shouldGrowRight = canGrowRight 
        && this.root.height >= this.root.width + width
    , shouldGrowDown = canGrowDown
        && this.root.width >= this.root.height + height;
  if (shouldGrowRight) {
    return this.growRight(width, height);
  } else if (shouldGrowDown) {
    return this.growDown(width, height);
  } else if (canGrowRight) {
    return this.growRight(width, height);
  } else if (canGrowDown) {
    return this.growDown(width, height);
  }
  return null;
};

Packer.prototype.growRight = function (width, height) {
  var node;
  this.root = {
    used: true,
    x: 0,
    y: 0,
    width: this.root.width + width,
    height: this.root.height,
    down: this.root,
    right: {
      x: this.root.width,
      y: 0,
      width: width,
      height: this.root.height
    }
  };
  if (node = this.findNode(this.root, width, height)) {
    return this.splitNode(node, width, height);
  }
  return null;
};

Packer.prototype.growDown = function (width, height) {
  var node;
  this.root = {
    used: true,
    x: 0,
    y: 0,
    width: this.root.width,
    height: this.root.height + height,
    down: {
      x: 0,
      y: this.root.height,
      width: this.root.width,
      height: height
    },
    right: this.root
  };
  if (node = this.findNode(this.root, width, height)) {
    return this.splitNode(node, width, height);
  }
  return null;
};

module.exports = Packer;
