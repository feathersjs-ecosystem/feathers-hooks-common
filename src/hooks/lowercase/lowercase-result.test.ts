import { assert } from 'vitest';
import { lowercaseResult } from './lowercase-result';

let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('lowercaseResult', () => {
  describe('updates data', () => {
    beforeEach(() => {
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
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
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      };
    });

    it('updates hook after::find with pagination', () => {
      lowercaseResult('first', 'last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'john', last: 'doe' },
        { first: 'jane', last: 'doe' },
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      lowercaseResult('first', 'last')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'john', last: 'doe' },
        { first: 'jane', last: 'doe' },
      ]);
    });

    it('updates hook after', () => {
      lowercaseResult('first', 'last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'jane', last: 'doe' });
    });
  });
});
