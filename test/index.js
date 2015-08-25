'use strict';

var sinon = require('sinon');
var mu = require('../');
var mutator = require('../').mutator;

describe('mutate-dom', function() {
  describe('mutate', function() {
    it('passes correct set of arguments', function() {
      var spy = sinon.spy();
      var fooMutator = mutator(spy);
      var mutate = fooMutator(3, 1, 2);
      mutate('.bar');

      spy.calledWithExactly('.bar', 3, 1, 2);
    });

    it('calls selector filter', function() {
      var spy = sinon.spy();
      var filterSpy = sinon.spy(function(selector) {
        return selector + '++';
      });
      var fooMutator = mutator(spy, filterSpy);
      var mutate = fooMutator(3, 1, 2);
      mutate('.bar');

      spy.calledWithExactly('.bar++', 3, 1, 2);
      filterSpy.calledWithExactly('.bar');
    });
  });

  describe('transform tree', function() {
    it('inserts HTML', function() {
      var el = document.createElement('div');
      el.className = 'foo';
      document.body.appendChild(el);

      mu({
        '.foo': 'bar'
      });

      expect(el.innerHTML).to.eq('bar');
      el.parentNode.removeChild(el);
    });
  });
});
