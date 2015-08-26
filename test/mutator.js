'use strict';

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);
var mutator = require('../lib/mutator');

describe('mutate-dom', function() {
  describe('mutate', function() {
    it('passes correct set of arguments', function() {
      var el = document.createElement('div');
      el.className = 'bar';

      var spy = sinon.spy();
      var fooMutator = mutator(spy);
      var mutate = fooMutator(3, 1, 2);
      mutate([el]);

      expect(spy).to.have.been.calledWithExactly(el, 3, 1, 2);
    });

    it('catches errors of the mutator', function() {
      var errorMutaror = sinon.spy(mutator(function() {
        throw new Error();
      }));

      errorMutaror()(['.foo']);
      expect(errorMutaror.exceptions.length).to.eq(1);
      expect(errorMutaror.exceptions[0]).to.be.undefined;
    });
  });
});
