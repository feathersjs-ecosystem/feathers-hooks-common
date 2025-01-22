import { assert } from 'vitest';
import { omitResult } from './omit-result';

let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('omitResult', () => {
  describe('removes fields', () => {
    beforeEach(() => {
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

    it('updates hook after::find with pagination', () => {
      omitResult('last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
    });

    it('updates hook after::find with no pagination', () => {
      omitResult('last')(hookFind);
      assert.deepEqual(hookFind.result, [{ first: 'John' }, { first: 'Jane' }]);
    });

    it('updates hook after', () => {
      omitResult('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('updates when called internally on server', () => {
      hookAfter.params.provider = '';
      omitResult('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });
  });

  describe('handles dot notation', () => {
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

      omitResult('email', 'password')(hook);

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

      omitResult('property.secret')(hook);

      assert.deepEqual(hook.result, {
        property: null,
        other: 'bar',
      });
    });
  });
});
