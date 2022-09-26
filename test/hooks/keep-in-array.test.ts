import { assert } from 'chai';

import { keepInArray } from '../../src';

let hookBefore: any;
let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;
let hookFindNested: any;

describe('services keepInArray', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: 'John', last: 'Doe' }] },
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { users: [{ first: 'Jane', last: 'Doe' }] },
      };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { users: [{ first: 'John', last: 'Doe' }] },
            { users: [{ first: 'Jane', last: 'Doe' }] },
          ],
        },
      };
      hookFind = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { users: [{ first: 'John', last: 'Doe' }] },
          { users: [{ first: 'Jane', last: 'Doe' }] },
        ],
      };
    });

    it('updates hook before::create', () => {
      keepInArray('users', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{ last: 'Doe' }] });
    });

    it('ignores bad or missing field', () => {
      keepInArray('xx', ['last'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{ first: 'John', last: 'Doe' }] });
    });

    it('updates hook after::find with pagination', () => {
      keepInArray('users', ['first'])(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { users: [{ first: 'John' }] },
        { users: [{ first: 'Jane' }] },
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      keepInArray('users', ['first'])(hookFind);
      assert.deepEqual(hookFind.result, [
        { users: [{ first: 'John' }] },
        { users: [{ first: 'Jane' }] },
      ]);
    });

    it('updates hook after', () => {
      keepInArray('users', ['first'])(hookAfter);
      assert.deepEqual(hookAfter.result, { users: [{ first: 'Jane' }] });
    });

    it('updates when called internally on server', () => {
      hookAfter.params.provider = '';
      keepInArray('users', ['first'])(hookAfter);
      assert.deepEqual(hookAfter.result, { users: [{ first: 'Jane' }] });
    });

    it('does not throw if field is missing', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: 'John', last: 'Doe' }] },
      };
      keepInArray('users', ['last', 'xx'])(hook);
      assert.deepEqual(hook.data, { users: [{ last: 'Doe' }] });
    });

    it('keeps undefined values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: undefined, last: 'Doe' }] },
      };
      keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: undefined }] });
    });

    it('keeps null values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: null, last: 'Doe' }] },
      };
      keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: null }] });
    });

    it('keeps false values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: false, last: 'Doe' }] },
      };
      keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: false }] });
    });

    it('keeps 0 values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: 0, last: 'Doe' }] },
      };
      keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: 0 }] });
    });

    it('keeps empty string values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { users: [{ first: '', last: 'Doe' }] },
      };
      keepInArray('users', ['first'])(hook);
      assert.deepEqual(hook.data, { users: [{ first: '' }] });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: {
          users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }],
        },
      };
      hookFindNested = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { account: { users: [{ first: 'John', last: 'Doe' }] } },
          { account: { users: [{ first: 'Jane', last: 'Doe' }] } },
        ],
      };
    });

    it('updates hook after::find with dot notation field ', () => {
      keepInArray('account.users', ['first'])(hookFindNested);
      assert.deepEqual(hookFindNested.result, [
        { account: { users: [{ first: 'John' }] } },
        { account: { users: [{ first: 'Jane' }] } },
      ]);
    });

    it('prop with no dots', () => {
      keepInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.data, {
        users: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }],
      });
    });

    it('prop with 1 dot', () => {
      keepInArray('users', ['empl.name', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.data, {
        users: [{ empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }],
      });
    });

    it('prop with 2 dots', () => {
      keepInArray('users', ['empl.name.last', 'empl.status', 'dept'])(hookBefore);
      assert.deepEqual(hookBefore.data, {
        users: [{ empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }],
      });
    });

    it('ignores bad or missing paths', () => {
      keepInArray('users', ['empl.name.first', 'empl.name.surname'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{ empl: { name: { first: 'John' } } }] });
    });

    it('ignores bad or missing no dot path', () => {
      keepInArray('users', ['xx'])(hookBefore);
      assert.deepEqual(hookBefore.data, { users: [{}] });
    });
  });

  describe('ignore non-object records', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [
          {
            users: [
              { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
              null,
              undefined,
              Infinity,
            ],
          },
          null,
          undefined,
          Infinity,
        ],
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [
          { users: [{ first: 'Jane', last: 'Doe' }, null, undefined, Infinity] },
          null,
          undefined,
          Infinity,
        ],
      };
    });

    it('before', () => {
      keepInArray('users', ['empl'])(hookBefore);
      assert.deepEqual(hookBefore.data, [
        {
          users: [
            { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } },
            null,
            undefined,
            Infinity,
          ],
        },
        null,
        undefined,
        Infinity,
      ]);
    });

    it('after', () => {
      keepInArray('users', ['first'])(hookAfter);
      assert.deepEqual(hookAfter.result, [
        { users: [{ first: 'Jane' }, null, undefined, Infinity] },
        null,
        undefined,
        Infinity,
      ]);
    });
  });
});
