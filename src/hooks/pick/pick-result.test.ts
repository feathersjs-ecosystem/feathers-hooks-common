import { assert } from 'vitest';
import { pickResult } from './pick-result';

let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('pickResult', () => {
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
      pickResult('first')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
    });

    it('updates hook after::find with no pagination', () => {
      pickResult('first')(hookFind);
      assert.deepEqual(hookFind.result, [{ first: 'John' }, { first: 'Jane' }]);
    });

    it('updates hook after', () => {
      pickResult('first')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('updates when called internally on server', () => {
      hookAfter.params.provider = '';
      pickResult('first')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });
  });

  describe('ignore non-object records', () => {
    beforeEach(() => {
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [{ first: 'Jane', last: 'Doe' }, null, undefined, Infinity],
      };
    });

    it('after', () => {
      pickResult('first')(hookAfter);
      assert.deepEqual(hookAfter.result, [{ first: 'Jane' }, null, undefined, Infinity]);
    });
  });
});
