// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFindNe... Remove this comment to see the full error message
let hookFindNested;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services keepQueryInArray', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('removes fields', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 'John', last: 'Doe' }] }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook before::find', () => {
      hooks.keepQueryInArray('users', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ last: 'Doe' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing field', () => {
      hooks.keepQueryInArray('xx', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ first: 'John', last: 'Doe' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('does not throw if field is missing', () => {
      const hook = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 'John', last: 'Doe' }] }
      };
      hooks.keepQueryInArray('users', ['last', 'xx'])(hook);
      assert.deepEqual(hook.query, { users: [{ last: 'Doe' }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps undefined values', () => {
      const hook = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: undefined, last: 'Doe' }] }
      };
      hooks.keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: undefined }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps null values', () => {
      const hook = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: null, last: 'Doe' }] }
      };
      hooks.keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: null }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps false values', () => {
      const hook = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: false, last: 'Doe' }] }
      };
      hooks.keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: false }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps 0 values', () => {
      const hook = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 0, last: 'Doe' }] }
      };
      hooks.keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: 0 }] });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('keeps empty string values', () => {
      const hook = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: '', last: 'Doe' }] }
      };
      hooks.keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: '' }] });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('handles dot notation', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }] }
      };
      hookFindNested = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { account: { users: [{ first: 'John', last: 'Doe' }] } }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('updates hook find with dot notation field ', () => {
      hooks.keepQueryInArray('account.users', ['first'])(hookFindNested);
      assert.deepEqual(hookFindNested.query, { account: { users: [{ first: 'John' }] } });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with no dots', () => {
      hooks.keepQueryInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 1 dot', () => {
      hooks.keepQueryInArray('users', ['empl.name', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('prop with 2 dots', () => {
      hooks.keepQueryInArray('users', ['empl.name.last', 'empl.status', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing paths', () => {
      hooks.keepQueryInArray('users', ['empl.name.first', 'empl.name.surname'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John' } } }] }
      );
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('ignores bad or missing no dot path', () => {
      hooks.keepQueryInArray('users', ['xx'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{}] });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('removes non-object records', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }, null, undefined, Infinity] }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('before', () => {
      hooks.keepQueryInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }, null, undefined, Infinity] }
      );
    });
  });
});
