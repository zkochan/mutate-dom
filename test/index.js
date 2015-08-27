'use strict';

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);
var mu = require('../');

describe('mutate-dom', function() {
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
      var containerEl = document.createElement('div');
      containerEl.id = 'bar';
      var el = document.createElement('span');
      el.className = 'foo';
      containerEl.appendChild(el);
      document.body.appendChild(containerEl);

      var spy = sinon.spy();

      mu({
        '#bar': {
          '.foo': spy
        }
      });

      expect(spy).to.have.been.calledWithExactly([el]);
      containerEl.parentNode.removeChild(containerEl);
    });

    it('calls several mutators in order', function() {
      var containerEl = document.createElement('div');
      containerEl.id = 'bar';
      var el = document.createElement('span');
      el.className = 'foo';
      containerEl.appendChild(el);
      document.body.appendChild(containerEl);

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
      expect(mutator1).to.have.been.calledWithExactly([el]);
      expect(mutator2).to.have.been.calledWithExactly([el]);
      containerEl.parentNode.removeChild(containerEl);
    });

    it('catches errors of the DOM crawler', function() {
      expect(function() {
        mu({
          '*=+-%': 'foo'
        });
      }).to.not.throw();
    });
  });

  describe('filter', function() {
    it('works', function() {
      var el = document.createElement('div');
      el.className = 'qar';
      document.body.appendChild(el);

      var spy = sinon.spy(function() {
        return [document.body];
      });
      var filter = mu.filter(spy);
      filter('foo', 'bar', {'.qar': 'some-content'})([1, 2, 3]);

      expect(spy).to.have.been.calledWithExactly([1, 2, 3], 'foo', 'bar');
      expect(el.innerHTML).to.eq('some-content');
      el.parentNode.removeChild(el);
    });
  });

  describe('slice', function() {
    it('works', function() {
      var el1 = document.createElement('div');
      el1.className = 'foo';
      el1.innerHTML = 'qaz';
      document.body.appendChild(el1);
      var el2 = document.createElement('div');
      el2.className = 'foo';
      el2.innerHTML = 'qaz';
      document.body.appendChild(el2);

      mu({
        '.foo': mu.slice(0, 1, 'bar')
      });

      expect(el1.innerHTML).to.eq('bar');
      expect(el2.innerHTML).to.eq('qaz');
      el1.parentNode.removeChild(el1);
      el2.parentNode.removeChild(el2);
    });
  });
});
