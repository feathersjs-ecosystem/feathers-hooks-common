import { assert } from 'vitest';
import { omit } from './omit';

let hookBefore: any;
let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('omit', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { first: 'Jane', last: 'Doe' },
      };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { first: 'John', last: 'Doe' },
            { first: 'Jane', last: 'Doe' },
          ],
        },
      };
      hookFind = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      };
    });

    it('updates hook before::create', () => {
      omit('first')(hookBefore);
      assert.deepEqual(hookBefore.data, { last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      omit('last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
    });

    it('updates hook after::find with no pagination', () => {
      omit('last')(hookFind);
      assert.deepEqual(hookFind.result, [{ first: 'John' }, { first: 'Jane' }]);
    });

    it('updates hook after', () => {
      omit('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('updates when called internally on server', () => {
      hookAfter.params.provider = '';
      omit('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('does not throw if field is missing', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      };
      omit('first', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is null', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: null, last: 'Doe' },
      };
      omit('first')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      };
    });

    it('prop with no dots', () => {
      omit('dept')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      });
    });

    it('prop with 1 dot', () => {
      omit('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' } },
        dept: 'Acct',
      });
    });

    it('prop with 2 dots', () => {
      omit('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      omit('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing no dot path', () => {
      omit('xx')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('discards multiple fields', () => {
      const hook: any = {
        type: 'after',
        method: 'get',
        result: {
          roles: ['super'],
          _id: 'a',
          email: 'foo',
          password: 'bar',
          name: 'Rafael',
          id: 'b',
        },
        query: {},
      };

      omit('email', 'password')(hook);

      assert.deepEqual(hook.result, {
        roles: ['super'],
        _id: 'a',
        // email: 'foo',
        // password: 'bar',
        name: 'Rafael',
        id: 'b',
      } as any);
    });

    it('null prop', () => {
      const hook: any = {
        type: 'after',
        method: 'get',
        result: {
          property: null,
          other: 'bar',
        },
        query: {},
      };

      omit('property.secret')(hook);

      assert.deepEqual(hook.result, {
        property: null,
        other: 'bar',
      });
    });
  });
});
