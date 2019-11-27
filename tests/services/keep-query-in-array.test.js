const { assert } = require('chai');
const hooks = require('../../lib/services');

let hookBefore;
let hookFindNested;

describe('services keepQueryInArray', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 'John', last: 'Doe' }] }
      };
    });

    it('updates hook before::find', () => {
      hooks.keepQueryInArray('users', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ last: 'Doe' }] });
    });

    it('ignores bad or missing field', () => {
      hooks.keepQueryInArray('xx', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ first: 'John', last: 'Doe' }] });
    });

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

  describe('handles dot notation', () => {
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

    it('updates hook find with dot notation field ', () => {
      hooks.keepQueryInArray('account.users', ['first'])(hookFindNested);
      assert.deepEqual(hookFindNested.query, { account: { users: [{ first: 'John' }] } });
    });

    it('prop with no dots', () => {
      hooks.keepQueryInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }] }
      );
    });

    it('prop with 1 dot', () => {
      hooks.keepQueryInArray('users', ['empl.name', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }] }
      );
    });

    it('prop with 2 dots', () => {
      hooks.keepQueryInArray('users', ['empl.name.last', 'empl.status', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }] }
      );
    });

    it('ignores bad or missing paths', () => {
      hooks.keepQueryInArray('users', ['empl.name.first', 'empl.name.surname'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John' } } }] }
      );
    });

    it('ignores bad or missing no dot path', () => {
      hooks.keepQueryInArray('users', ['xx'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{}] });
    });
  });

  describe('removes non-object records', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }, null, undefined, Infinity] }
      };
    });

    it('before', () => {
      hooks.keepQueryInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.query,
        { users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }, null, undefined, Infinity] }
      );
    });
  });
});
