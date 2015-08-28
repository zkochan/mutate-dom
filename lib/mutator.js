'use strict';

var forEach = require('array-foreach');

/**
 * A helper for mutators creation.
 * @param {mutatorCallback} fn - A function that's doing the mutation.
 * @returns {Function} - Mutator.
 */
function mutator(fn) {
  return function() {
    var props = Array.prototype.slice.call(arguments);
    return function(elements) {
      forEach(elements, function(el) {
        try {
          fn.apply(null, [el].concat(props));
        } catch(err) {
          console.log(err);
        }
      });
    };
  };
}

/**
 * This callback does the mutations.
 * @callback mutatorCallback
 * @param Element element - The DOM element to mutate.
 * @param [{...*}] param - Parameters passed to the mutator.
 * @example
 * function updateId(el, id) {
 *   el.id = id;
 * }
 */

module.exports = mutator;
