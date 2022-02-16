
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'actOnDefau... Remove this comment to see the full error message
const { actOnDefault, actOnDispatch, combine, getItems, replaceItems } = require('../lib');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testHook'.
function testHook (what: any, code: any) {
  return (context: any) => {
    if (context.params._actOn !== what) {
      throw new Error(
        `Hook code ${code} expected ${what} found ${context.params._actOn}`
      );
    }

    context.params._actOnCodes.push(code);
  };
}

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services actOn', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Call hooks which do not call other hooks', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'get', params: { _actOnCodes: [] } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('actOnDefault', async () => {
      const result = await actOnDefault(
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        testHook(undefined, 1), testHook(undefined, 2), testHook(undefined, 3)
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [1, 2, 3]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('actOnDispatch', async () => {
      const result = await actOnDispatch(
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        testHook('dispatch', 10), testHook('dispatch', 20), testHook('dispatch', 30)
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [10, 20, 30]);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Call hooks calling others same actOn', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'get', params: { _actOnCodes: [] } };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('actOnDefault calling actOnDefault', async () => {
      const result = await actOnDefault(
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        combine(testHook(undefined, 11), testHook(undefined, 12)),
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        combine(testHook(undefined, 21), testHook(undefined, 22))
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [11, 12, 21, 22]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('actOnDefault calling actOnDispatch', async () => {
      const result = await actOnDefault(
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        actOnDispatch(combine(testHook('dispatch', 11), testHook('dispatch', 12))),
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        combine(testHook(undefined, 21), testHook(undefined, 22))
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [11, 12, 21, 22]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('actOnDispatch calling actOnDefault', async () => {
      const result = await actOnDispatch(
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        actOnDefault(combine(testHook(undefined, 11), testHook(undefined, 12))),
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        combine(testHook('dispatch', 21), testHook('dispatch', 22))
      )(hookBefore);

      assert.deepEqual(result.params._actOnCodes, [11, 12, 21, 22]);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getItems & replaceItems', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Gets dispatch data', () => {
      assert.deepEqual(getItems(hookBefore), hookBefore.dispatch);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Returns dispatch data', () => {
      replaceItems(hookBefore, { foo: 'bar' });

      assert.deepEqual(hookBefore.dispatch, { foo: 'bar' });
    });
  });
});
