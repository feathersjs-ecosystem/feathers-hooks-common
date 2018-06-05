
const { assert } = require('chai');
const { actOnDefault, actOnDispatch, combine, getItems, replaceItems } = require('../lib');

let hookBefore;

function testHook (what, code) {
  return context => {
    if (context.params._actOn !== what) {
      throw new Error(
        `Hook code ${code} expected ${what} found ${context.params._actOn}`
      );
    }

    context.params._actOnCodes.push(code);
  };
}

describe('services actOn', () => {
  describe('Call hooks which do not call other hooks', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'get', params: { _actOnCodes: [] } };
    });

    it('actOnDefault', async () => {
      const result = await actOnDefault(
        testHook(undefined, 1), testHook(undefined, 2), testHook(undefined, 3)
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [1, 2, 3]);
    });

    it('actOnDispatch', async () => {
      const result = await actOnDispatch(
        testHook('dispatch', 10), testHook('dispatch', 20), testHook('dispatch', 30)
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [10, 20, 30]);
    });
  });

  describe('Call hooks calling others same actOn', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'get', params: { _actOnCodes: [] } };
    });

    it('actOnDefault calling actOnDefault', async () => {
      const result = await actOnDefault(
        combine(testHook(undefined, 11), testHook(undefined, 12)),
        combine(testHook(undefined, 21), testHook(undefined, 22))
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [11, 12, 21, 22]);
    });

    it('actOnDefault calling actOnDispatch', async () => {
      const result = await actOnDefault(
        actOnDispatch(combine(testHook('dispatch', 11), testHook('dispatch', 12))),
        combine(testHook(undefined, 21), testHook(undefined, 22))
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [11, 12, 21, 22]);
    });

    it('actOnDispatch calling actOnDefault', async () => {
      const result = await actOnDispatch(
        actOnDefault(combine(testHook(undefined, 11), testHook(undefined, 12))),
        combine(testHook('dispatch', 21), testHook('dispatch', 22))
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [11, 12, 21, 22]);
    });
  });

  describe('getItems & replaceItems', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'get',
        data: { a: 1 },
        result: { b: 2 },
        dispatch: { c: 3 },
        params: { _actOn: 'dispatch' }
      };
    });

    it('Gets dispatch data', () => {
      assert.deepEqual(getItems(hookBefore), hookBefore.dispatch);
    });

    it('Returns dispatch data', () => {
      replaceItems(hookBefore, { foo: 'bar' });

      assert.deepEqual(hookBefore.dispatch, { foo: 'bar' });
    });
  });
});
