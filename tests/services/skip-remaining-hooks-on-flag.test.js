
const SKIP = require('@feathersjs/feathers').SKIP;
const { assert } = require('chai');

const { skipRemainingHooksOnFlag } = require('../../lib/services');

let hookBefore;
let hookBeforeRawRecord;
let hookBeforeAbc;
let hookAfter;
let hookAfterRawRecord;
let hookAfterAbc;

describe('services skipRemainingHooksOnFlag', () => {
  beforeEach(() => {
    hookBefore = {type: 'before', method: 'create', data: {first: 'John', last: 'Doe'}};
    hookBeforeRawRecord = {type: 'before',
      method: 'create',
      data: {first: 'John', last: 'Doe'},
      params: { $rawRecord: true } };
    hookBeforeAbc = {type: 'before',
      method: 'create',
      data: {first: 'John', last: 'Doe'},
      params: { abc: true } };
    hookAfter = {type: 'after', method: 'create', result: {first: 'Jane', last: 'Doe'}};
    hookAfterRawRecord = {type: 'after',
      method: 'create',
      result: {first: 'Jane', last: 'Doe'},
      params: { $rawRecord: true } };
    hookAfterAbc = {type: 'after',
      method: 'create',
      result: {first: 'Jane', last: 'Doe'},
      params: { abc: true } };
  });

  describe('uses $rawRecord default flag', () => {
    it('Flag false in before', () => {
      const result = skipRemainingHooksOnFlag()(hookBefore);

      assert.equal(result, hookBefore);
    });

    it('Flag true in before', () => {
      const result = skipRemainingHooksOnFlag()(hookBeforeRawRecord);

      assert.equal(result, SKIP);
    });

    it('Flag false in after', () => {
      const result = skipRemainingHooksOnFlag()(hookAfter);

      assert.equal(result, hookAfter);
    });

    it('Flag true in after', () => {
      const result = skipRemainingHooksOnFlag()(hookAfterRawRecord);

      assert.equal(result, SKIP);
    });
  });

  describe('uses provided flag', () => {
    it('Flag false in before', () => {
      const result = skipRemainingHooksOnFlag('abc')(hookBefore);

      assert.equal(result, hookBefore);
    });

    it('Flag true in before', () => {
      const result = skipRemainingHooksOnFlag(['abc'])(hookBeforeAbc);

      assert.equal(result, SKIP);
    });

    it('Flag false in after', () => {
      const result = skipRemainingHooksOnFlag('abc')(hookAfter);

      assert.equal(result, hookAfter);
    });

    it('Flag true in after', () => {
      const result = skipRemainingHooksOnFlag(['def', 'abc'])(hookAfterAbc);

      assert.equal(result, SKIP);
    });
  });
});
