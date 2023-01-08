
import { assert } from 'chai';
import { trim } from '../../src';

let hookBefore: any;
let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('services trim', () => {
  describe('updates data', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: ' John', last: 'Doe ' } };
      hookAfter = { type: 'after', method: 'create', result: { first: ' Jane', last: ' Doe' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        result: {
          total: 2,
          data: [
            { first: ' John', last: 'Doe ' },
            { first: ' Jane ', last: ' Doe' }
          ]
        }
      };
      hookFind = {
        type: 'after',
        method: 'find',
        result: [
          { first: ' John', last: 'Doe ' },
          { first: ' Jane ', last: ' Doe' }
        ]
      };
    });

    it('updates hook before::create', () => {
      trim('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      trim('first', 'last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      trim('first', 'last')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('updates hook after', () => {
      trim('first', 'last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe' });
    });

    it('does not throw if field is missing', () => {
      const hook: any = { type: 'before', method: 'create', data: { last: 'Doe ' } };
      trim('first', 'last')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: undefined, last: 'Doe ' } };
      trim('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: undefined, last: 'Doe' });
    });

    it('does not throw if field is null', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: null, last: ' Doe ' } };
      trim('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: null, last: 'Doe' });
    });

    it('throws if field is not a string', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: 1, last: 'Doe ' } };
      assert.throws(() => { trim('first', 'last')(hook); });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        data: { empl: { name: { first: ' John', last: 'Doe ' }, status: 'Aa ' }, dept: ' Acct ' }
      };
    });

    it('prop with no dots', () => {
      trim('dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: ' John', last: 'Doe ' }, status: 'Aa ' }, dept: 'Acct' }
      );
    });

    it('prop with 1 dot', () => {
      trim('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: ' John', last: 'Doe ' }, status: 'Aa' }, dept: ' Acct ' }
      );
    });

    it('prop with 2 dots', () => {
      trim('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe ' }, status: 'Aa ' }, dept: ' Acct ' }
      );
    });

    it('ignores bad or missing paths', () => {
      trim('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: ' John', last: 'Doe ' }, status: 'Aa ' }, dept: ' Acct ' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      trim('xx')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: ' John', last: 'Doe ' }, status: 'Aa ' }, dept: ' Acct ' }
      );
    });
  });
});
