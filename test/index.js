'use strict';

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);
var mu = require('../');
var mutator = require('../').mutator;

describe('mutate-dom', function() {
  describe('mutate', function() {
    it('passes correct set of arguments', function() {
      var el = document.createElement('div');
      el.className = 'bar';
      document.body.appendChild(el);

      var spy = sinon.spy();
      var fooMutator = mutator(spy);
      var mutate = fooMutator(3, 1, 2);
      mutate('.bar');

      expect(spy).to.have.been.calledWithExactly(el, 3, 1, 2);
      el.parentNode.removeChild(el);
    });

    it('calls selector filter', function() {
      var el = document.createElement('div');
      el.className = 'bar';
      document.body.appendChild(el);

      var spy = sinon.spy();
      var filterSpy = sinon.spy(function(selector) {
        return '++';
      });
      var fooMutator = mutator(spy, filterSpy);
      var mutate = fooMutator(3, 1, 2);
      mutate('.bar');

      expect(spy).to.have.been.calledWithExactly('++', 3, 1, 2);
      expect(filterSpy).to.have.been.calledWithExactly(el);

      el.parentNode.removeChild(el);
    });

    it('catches errors of the mutator', function() {
      var errorMutaror = sinon.spy(mutator(function() {
        throw new Error();
      }));

      errorMutaror()('.foo');
      expect(errorMutaror.exceptions.length).to.eq(1);
      expect(errorMutaror.exceptions[0]).to.be.undefined;
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

      expect(spy).to.have.been.calledWithExactly('#bar .foo');
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


      expect(mutator1).to.have.been.calledBefore(mutator2);
      expect(mutator1).to.have.been.calledWithExactly('#bar .foo');
      expect(mutator2).to.have.been.calledWithExactly('#bar .foo');
    });
  });
});
