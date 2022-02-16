
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFindPa... Remove this comment to see the full error message
let hookFindPaginate;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFind'.
let hookFind;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFindNe... Remove this comment to see the full error message
let hookFindNested: any;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services keepInArray', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('removes fields', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: 'John', last: 'Doe' }] }
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { users: [{ first: 'Jane', last: 'Doe' }] }
      };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { users: [{ first: 'John', last: 'Doe' }] },
            { users: [{ first: 'Jane', last: 'Doe' }] }
          ]
        }
      };
      hookFind = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { users: [{ first: 'John', last: 'Doe' }] },
          { users: [{ first: 'Jane', last: 'Doe' }] }
        ]
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::create', () => {
      hooks.keepInArray('users', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{ last: 'Doe' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing field', () => {
      hooks.keepInArray('xx', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{ first: 'John', last: 'Doe' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find with pagination', () => {
      hooks.keepInArray('users', ['first'])(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { users: [{ first: 'John' }] },
        { users: [{ first: 'Jane' }] }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find with no pagination', () => {
      hooks.keepInArray('users', ['first'])(hookFind);
      assert.deepEqual(hookFind.result, [
        { users: [{ first: 'John' }] },
        { users: [{ first: 'Jane' }] }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after', () => {
      hooks.keepInArray('users', ['first'])(hookAfter);
      assert.deepEqual(hookAfter.result, { users: [{ first: 'Jane' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates when called internally on server', () => {
      hookAfter.params.provider = '';
      hooks.keepInArray('users', ['first'])(hookAfter);
      assert.deepEqual(hookAfter.result, { users: [{ first: 'Jane' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw if field is missing', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: 'John', last: 'Doe' }] }
      };
      hooks.keepInArray('users', ['last', 'xx'])(hook);
      assert.deepEqual(hook.data, { users: [{ last: 'Doe' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps undefined values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: undefined, last: 'Doe' }] }
      };
      hooks.keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: undefined }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps null values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: null, last: 'Doe' }] }
      };
      hooks.keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: null }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps false values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: false, last: 'Doe' }] }
      };
      hooks.keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: false }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps 0 values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: 0, last: 'Doe' }] }
      };
      hooks.keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: 0 }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps empty string values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: '', last: 'Doe' }] }
      };
      hooks.keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: '' }] });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles dot notation', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }] }
      };
      hookFindNested = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { account: { users: [{ first: 'John', last: 'Doe' }] } },
          { account: { users: [{ first: 'Jane', last: 'Doe' }] } }
        ]
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook after::find with dot notation field ', () => {
      hooks.keepInArray('account.users', ['first'])(hookFindNested);
      assert.deepEqual(hookFindNested.result, [
        { account: { users: [{ first: 'John' }] } },
        { account: { users: [{ first: 'Jane' }] } }
      ]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with no dots', () => {
      hooks.keepInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.data,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 1 dot', () => {
      hooks.keepInArray('users', ['empl.name', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.data,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 2 dots', () => {
      hooks.keepInArray('users', ['empl.name.last', 'empl.status', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.data,
        { users: [{ empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing paths', () => {
      hooks.keepInArray('users', ['empl.name.first', 'empl.name.surname'])(hookBefore);
      assert.deepEqual(hookBefore.data,
        { users: [{ empl: { name: { first: 'John' } } }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing no dot path', () => {
      hooks.keepInArray('users', ['xx'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{}] });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('ignore non-object records', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [{ users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }, null, undefined, Infinity] }, null, undefined, Infinity]
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [{ users: [{ first: 'Jane', last: 'Doe' }, null, undefined, Infinity] }, null, undefined, Infinity]
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('before', () => {
      hooks.keepInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.data,
        [{ users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }, null, undefined, Infinity] }, null, undefined, Infinity]
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('after', () => {
      hooks.keepInArray('users', ['first'])(hookAfter);
      assert.deepEqual(hookAfter.result,
        [{ users: [{ first: 'Jane' }, null, undefined, Infinity] }, null, undefined, Infinity]
      );
    });
  });
});
