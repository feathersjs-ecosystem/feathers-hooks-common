
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// Tests when context.params._actOn === 'dispatch' are in act-on.test.js

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services getItems & replaceItems', () => {
  let hookBefore: any;
  let hookAfter: any;
  let hookBeforeArray: any;
  let hookAfterArray: any;
  let hookFindPaginate: any;
  let hookFind: any;

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('getItems', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' }
      };
      hookBeforeArray = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Doe' }]
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { first: 'Jane2', last: 'Doe2' }
      };
      hookAfterArray = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [{ first: 'John2', last: 'Doe2' }, { first: 'Jane', last: 'Doe' }]
      };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { first: 'John3', last: 'Doe3' },
            { first: 'Jane3', last: 'Doe3' }
          ]
        }
      };
      hookFind = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' }
        ]
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create item', () => {
      const stuff = hooks.getItems(hookBefore);
      assert.deepEqual(stuff, { first: 'John', last: 'Doe' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create items', () => {
      const stuff = hooks.getItems(hookBeforeArray);
      assert.deepEqual(stuff, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::create item', () => {
      const stuff = hooks.getItems(hookAfter);
      assert.deepEqual(stuff, { first: 'Jane2', last: 'Doe2' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::create items', () => {
      const stuff = hooks.getItems(hookAfterArray);
      assert.deepEqual(stuff, [
        { first: 'John2', last: 'Doe2' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find item', () => {
      const stuff = hooks.getItems(hookFindPaginate);
      assert.deepEqual(stuff, [
        { first: 'John3', last: 'Doe3' },
        { first: 'Jane3', last: 'Doe3' }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find item paginated', () => {
      const stuff = hooks.getItems(hookFind);
      assert.deepEqual(stuff, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw on before without data', () => {
      const hookBad = { type: 'before', method: 'create', params: { provider: 'rest' } };
      const stuff = hooks.getItems(hookBad);
      assert.equal(stuff, undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw on after without data', () => {
      const hookBad = { type: 'after', method: 'find', params: { provider: 'rest' } };
      const stuff = hooks.getItems(hookBad);
      assert.equal(stuff, undefined);
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('replaceItems', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' } };
      hookAfter = { type: 'after', method: 'create', params: { provider: 'rest' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 200,
          data: []
        }
      };
      hookFind = {
        type: 'after', method: 'find', params: { provider: 'rest' }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create item', () => {
      hooks.replaceItems(hookBefore, { a: 1 });
      assert.deepEqual(hookBefore.data, { a: 1 });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create items', () => {
      hooks.replaceItems(hookBefore, [{ a: 1 }, { b: 2 }]);
      assert.deepEqual(hookBefore.data, [{ a: 1 }, { b: 2 }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::create item', () => {
      hooks.replaceItems(hookAfter, { a: 1 });
      assert.deepEqual(hookAfter.result, { a: 1 });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::create items', () => {
      hooks.replaceItems(hookAfter, [{ a: 1 }, { b: 2 }]);
      assert.deepEqual(hookAfter.result, [{ a: 1 }, { b: 2 }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find item', () => {
      hooks.replaceItems(hookFind, { a: 1 });
      assert.deepEqual(hookFind.result, { a: 1 });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find items', () => {
      hooks.replaceItems(hookFind, [{ a: 1 }, { b: 2 }]);
      assert.deepEqual(hookFind.result, [{ a: 1 }, { b: 2 }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find item paginated  NOTE THIS TEST NOTE THIS TEST', () => {
      hooks.replaceItems(hookFindPaginate, { a: 1 });
      assert.equal(hookFindPaginate.result.total, 200);
      assert.deepEqual(hookFindPaginate.result.data, [{ a: 1 }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find items paginated', () => {
      hooks.replaceItems(hookFindPaginate, [{ a: 1 }, { b: 2 }]);
      assert.equal(hookFindPaginate.result.total, 200);
      assert.deepEqual(hookFindPaginate.result.data, [{ a: 1 }, { b: 2 }]);
    });
  });
});
