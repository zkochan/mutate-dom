'use strict';

function mutator(fn, $) {
  return function() {
    var props = Array.prototype.slice.call(arguments);
    return function(selector) {
      selector = $ ? $(selector) : selector;
      fn.apply(selector, [selector].concat(props));
    };
  };
}

var muHtml = mutator(function(selector, html) {
  [].forEach.call(document.querySelectorAll(selector), function(el) {
    el.innerHtml = html;
  });
});

function applyTransform(selector, value) {
  switch (typeof value) {
    case 'string':
    case 'number': {
      muHtml(value)(selector);
      break;
    }
    case 'object': {
      if (value instanceof Array) {
        for (var i = value.length; i--;) {
          applyTransform(selector, value[i]);
        }
      } else {
        transformTree(selector, value);
      }
      break;
    }
    case 'function': {
      value(selector);
      break;
    }
    default: {
      console.log('unsuported type in applyTransform');
      break;
    }
  }
}

/**
 * @param {String} [parent] - Parent selector.
 * @param {Object} tree - An object describing the DOM tree.
 */
function transformTree() {
  var tree, parent;
  if (arguments.length === 2) {
    parent = arguments[0];
    tree = arguments[1];
  } else if (arguments.length === 1) {
    parent = '';
    tree = arguments[0];
  }
  for (var key in tree) {
    var value = tree[key];
    var selector = [parent, key].join(' ');
    applyTransform(selector, value);
  }
}

module.exports = exports = transformTree;
exports.html = muHtml;
exports.mutator = mutator;