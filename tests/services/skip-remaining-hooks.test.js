
const SKIP = require('@feathersjs/feathers').SKIP;
const { assert } = require('chai');

const { skipRemainingHooks } = require('../../lib/services');

let hookBefore;
let hookAfter;

describe('services skipRemainingHooks', () => {
  describe('updated fields', () => {
    beforeEach(() => {
      hookBefore = {type: 'before', method: 'create', data: {first: 'John', last: 'Doe'}};
      hookAfter = {type: 'after', method: 'create', result: {first: 'Jane', last: 'Doe'}};
    });

    describe('predicate is not a function', () => {
      it('False returns context', () => {
        const result = skipRemainingHooks(false)(hookBefore);

        assert.equal(result, hookBefore);
      });

      it('True returns skip token', () => {
        const result = skipRemainingHooks(true)(hookBefore);

        assert.equal(result, SKIP);
      });
    });

    describe('predicate is a function', () => {
      it('False returns context', () => {
        const result = skipRemainingHooks(context => false)(hookBefore);

        assert.equal(result, hookBefore);
      });

      it('True returns skip token', () => {
        const result = skipRemainingHooks(context => true)(hookBefore);

        assert.equal(result, SKIP);
      });
    });

    describe('default predicate checks context.result', () => {
      it('No context.result', () => {
        const result = skipRemainingHooks()(hookBefore);

        assert.equal(result, hookBefore);
      });

      it('Has con text.result', () => {
        const result = skipRemainingHooks()(hookAfter);

        assert.equal(result, SKIP);
      });
    });
  });
});
