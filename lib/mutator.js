'use strict';

function mutator(fn, $) {
  return function() {
    var props = Array.prototype.slice.call(arguments);
    return function(selector) {
      try {
        [].forEach.call(document.querySelectorAll(selector), function(el) {
          el = $ ? $(el) : el;
          fn.apply(el, [el].concat(props));
        });
      } catch(err) {
        console.log(err);
      }
    };
  };
}

module.exports = mutator;
