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
