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

      expect(spy.calledWithExactly('.bar', 3, 1, 2)).to.be.true;
    });

    it('calls selector filter', function() {
      var spy = sinon.spy();
      var filterSpy = sinon.spy(function(selector) {
        return selector + '++';
      });
      var fooMutator = mutator(spy, filterSpy);
      var mutate = fooMutator(3, 1, 2);
      mutate('.bar');

      expect(spy.calledWithExactly('.bar++', 3, 1, 2)).to.be.true;
      expect(filterSpy.calledWithExactly('.bar')).to.be.true;
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

    it('inserts HTML when in array', function() {
      var el = document.createElement('div');
      el.className = 'foo';
      document.body.appendChild(el);

      mu({
        '.foo': ['bar']
      });

      expect(el.innerHTML).to.eq('bar');
      el.parentNode.removeChild(el);
    });

    it('inserts HTML to subtree', function() {
      var containerEl = document.createElement('div');
      containerEl.className = 'foo';
      var el = document.createElement('span');
      el.id = 'some-id';
      containerEl.appendChild(el);
      document.body.appendChild(containerEl);

      mu({
        '.foo': {
          'span#some-id': 'bar'
        }
      });

      expect(el.innerHTML).to.eq('bar');
      containerEl.parentNode.removeChild(containerEl);
    });

    it('inserts HTML to subtree in array', function() {
      var containerEl = document.createElement('div');
      containerEl.className = 'foo';
      var el = document.createElement('span');
      el.id = 'some-id';
      containerEl.appendChild(el);
      document.body.appendChild(containerEl);

      mu({
        '.foo': [{
          'span#some-id': 'bar'
        }]
      });

      expect(el.innerHTML).to.eq('bar');
      containerEl.parentNode.removeChild(containerEl);
    });

    it('calls mutator', function() {
      var spy = sinon.spy();

      mu({
        '#bar': {
          '.foo': spy
        }
      });

      expect(spy.calledWithExactly('#bar .foo')).to.be.true;
    });

    it('calls several mutators in order', function() {
      var mutator1 = sinon.spy();
      var mutator2 = sinon.spy();

      mu({
        '#bar': {
          '.foo': [
            mutator1,
            mutator2
          ]
        }
      });


      sinon.assert.callOrder(mutator1, mutator2);
      expect(mutator1.calledWithExactly('#bar .foo')).to.be.true;
      expect(mutator2.calledWithExactly('#bar .foo')).to.be.true;
    });
  });
});
