import { assert } from 'vitest';
import { keepQueryInArray } from '../../src';

let hookBefore: any;
let hookFindNested: any;

describe('services keepQueryInArray', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 'John', last: 'Doe' }] },
      };
    });

    it('updates hook before::find', () => {
      keepQueryInArray('users', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ last: 'Doe' }] });
    });

    it('ignores bad or missing field', () => {
      keepQueryInArray('xx', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ first: 'John', last: 'Doe' }] });
    });

    it('does not throw if field is missing', () => {
      const hook: any = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 'John', last: 'Doe' }] },
      };
      keepQueryInArray('users', ['last', 'xx'])(hook);
      assert.deepEqual(hook.query, { users: [{ last: 'Doe' }] });
    });

    it('keeps undefined values', () => {
      const hook: any = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: undefined, last: 'Doe' }] },
      };
      keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: undefined }] });
    });

    it('keeps null values', () => {
      const hook: any = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: null, last: 'Doe' }] },
      };
      keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: null }] });
    });

    it('keeps false values', () => {
      const hook: any = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: false, last: 'Doe' }] },
      };
      keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: false }] });
    });

    it('keeps 0 values', () => {
      const hook: any = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: 0, last: 'Doe' }] },
      };
      keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: 0 }] });
    });

    it('keeps empty string values', () => {
      const hook: any = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { users: [{ first: '', last: 'Doe' }] },
      };
      keepQueryInArray('users', ['first'])(hook);
      assert.deepEqual(hook.query, { users: [{ first: '' }] });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: {
          users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }],
        },
      };
      hookFindNested = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: { account: { users: [{ first: 'John', last: 'Doe' }] } },
      };
    });

    it('updates hook find with dot notation field ', () => {
      keepQueryInArray('account.users', ['first'])(hookFindNested);
      assert.deepEqual(hookFindNested.query, { account: { users: [{ first: 'John' }] } });
    });

    it('prop with no dots', () => {
      keepQueryInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.query, {
        users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }],
      });
    });

    it('prop with 1 dot', () => {
      keepQueryInArray('users', ['empl.name', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.query, {
        users: [{ empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }],
      });
    });

    it('prop with 2 dots', () => {
      keepQueryInArray('users', ['empl.name.last', 'empl.status', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.query, {
        users: [{ empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }],
      });
    });

    it('ignores bad or missing paths', () => {
      keepQueryInArray('users', ['empl.name.first', 'empl.name.surname'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{ empl: { name: { first: 'John' } } }] });
    });

    it('ignores bad or missing no dot path', () => {
      keepQueryInArray('users', ['xx'])(hookBefore);
      assert.deepEqual(hookBefore.query, { users: [{}] });
    });
  });

  describe('removes non-object records', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'find',
        params: { provider: 'rest' },
        query: {
          users: [
            { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
            null,
            undefined,
            Infinity,
          ],
        },
      };
    });

    it('before', () => {
      keepQueryInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.query, {
        users: [
          { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } },
          null,
          undefined,
          Infinity,
        ],
      });
    });
  });
});
