
const SKIP = require('@feathersjs/feathers').SKIP;
const { assert } = require('chai');

const { skipRemainingHooks } = require('../../lib/services');

let hookBefore;
let hookAfter;

describe('services skipRemainingHooks', () => {
  describe('updated fields', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
    });

    describe('predicate is not a function', () => {
      it('False returns context', () => {
        return skipRemainingHooks(false)(hookBefore)
          .then(result => assert.equal(result, hookBefore));
      });

      it('True returns skip token', () => {
        return skipRemainingHooks(true)(hookBefore)
          .then(result => assert.equal(result, SKIP));
      });
    });

    describe('predicate is a function', () => {
      it('False returns context', () => {
        return skipRemainingHooks(context => false)(hookBefore)
          .then(result => assert.equal(result, hookBefore));
      });

      it('True returns skip token', () => {
        return skipRemainingHooks(context => true)(hookBefore)
          .then(result => assert.equal(result, SKIP));
      });
    });

    describe('predicate resolves to a promise', () => {
      it('False returns context', () => {
        return skipRemainingHooks(context => Promise.resolve(false))(hookBefore)
          .then(result => assert.equal(result, hookBefore));
      });

      it('True returns skip token', () => {
        return skipRemainingHooks(context => Promise.resolve(true))(hookBefore)
          .then(result => assert.equal(result, SKIP));
      });

      it('Error returns skip token', () => {
        return skipRemainingHooks(context => Promise.reject(new Error()))(hookBefore)
          .then(result => assert.equal(result, SKIP));
      });
    });

    describe('predicate is a promise', () => {
      it('False returns context', () => {
        return skipRemainingHooks(Promise.resolve(false))(hookBefore)
          .then(result => assert.equal(result, hookBefore));
      });

      it('True returns skip token', () => {
        return skipRemainingHooks(Promise.resolve(true))(hookBefore)
          .then(result => assert.equal(result, SKIP));
      });

      it('Error returns skip token', () => {
        return skipRemainingHooks(Promise.reject(new Error()))(hookBefore)
          .then(result => assert.equal(result, SKIP));
      });
    });

    describe('default predicate checks context.result', () => {
      it('No context.result', () => {
        return skipRemainingHooks()(hookBefore)
          .then(result => assert.equal(result, hookBefore));
      });

      it('Has con text.result', () => {
        return skipRemainingHooks()(hookAfter)
          .then(result => assert.equal(result, SKIP));
      });
    });
  });
});
