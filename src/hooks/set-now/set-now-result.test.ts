import { assert } from 'vitest';
import { setNowResult } from './set-now-result';
import { clone } from '../../common';

let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('setNowResult', () => {
  describe('updated fields', () => {
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
      setNowResult('createdAt')(hookFindPaginate);

      checkHook(hookFindPaginate.result.data[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFindPaginate.result.data[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after::find with no pagination', () => {
      setNowResult('createdAt')(hookFind);
      checkHook(hookFind.result[0], { first: 'John', last: 'Doe' }, 'createdAt');
      checkHook(hookFind.result[1], { first: 'Jane', last: 'Doe' }, 'createdAt');
    });

    it('updates hook after', () => {
      setNowResult('createdAt')(hookAfter);
      checkHook(hookAfter.result, { first: 'Jane', last: 'Doe' }, 'createdAt');
    });
  });
});

// Helpers

function checkHook(item: any, template: any, dateFields: any) {
  const item1 = clone(item);
  if (typeof dateFields === 'string') {
    dateFields = [dateFields];
  }

  dateFields.forEach((dateField: any) => {
    assert.instanceOf(item[dateField], Date, 'not instance of Date');
    item1[dateField] = undefined;
    delete item1[dateField];
  });

  assert.deepEqual(item1, template, 'objects differ');
}
