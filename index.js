'use strict';

var forEach = require('array-foreach');
var mutator = require('./lib/mutator');

var muHtml = mutator(function(el, html) {
  el.innerHTML = html;
});

function applyTransform(elements, value) {
  switch (typeof value) {
    case 'string':
    case 'number': {
      muHtml(value)(elements);
      break;
    }
    case 'object': {
      if (value instanceof Array) {
        for (var i = 0, len = value.length; i < len; i++) {
          applyTransform(elements, value[i]);
        }
      } else {
        transformTree(elements, value);
      }
      break;
    }
    case 'function': {
      value(elements);
      break;
    }
    default: {
      console.log('unsuported type in applyTransform');
      break;
    }
  }
}

function find(parents, selector) {
  var result = [];
  forEach(parents, function(parent) {
    try {
      var children = Array.prototype.slice.call(parent.querySelectorAll(selector));
      result = result.concat(children);
    } catch(err) {
      console.log(err);
    }
  });
  return result;
}

/**
 * @param {String} [parent] - Parent selector.
 * @param {Object} tree - An object describing the DOM tree.
 */
function transformTree() {
  var tree, parents;
  if (arguments.length === 2) {
    parents = arguments[0];
    tree = arguments[1];
  } else if (arguments.length === 1) {
    parents = [document];
    tree = arguments[0];
  }
  for (var key in tree) {
    var value = tree[key];
    var elements = find(parents, key);
    applyTransform(elements, value);
  }
}

function filter(fn) {
  return function() {
    var args = Array.prototype.slice.call(arguments, 0, -1);
    var value = arguments[arguments.length - 1];
    return function(elements) {
      var filteredElements = fn.apply(null, [elements].concat(args));
      applyTransform(filteredElements, value);
    };
  };
}

var slice = filter(function(elements, start, end) {
  return elements.slice(start, end);
});

module.exports = exports = transformTree;
exports.html = muHtml;
exports.mutator = mutator;
exports.filter = filter;
exports.slice = slice;
