'use strict';

function mutator(fn) {
  return function() {
    var props = Array.prototype.slice.call(arguments);
    return function(elements) {
      elements.forEach(function(el) {
        try {
          fn.apply(null, [el].concat(props));
        } catch(err) {
          console.log(err);
        }
      });
    };
  };
}

module.exports = mutator;
