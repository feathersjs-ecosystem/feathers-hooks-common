
import { assert } from 'chai';
import { capitalize } from '../../src';

let hookBefore: any;
let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('services capitalize', () => {
  describe('updates data', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'DOE' } };
      hookAfter = { type: 'after', method: 'create', result: { first: 'jane', last: 'doE' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        result: {
          total: 2,
          data: [
            { first: 'John', last: 'DOE' },
            { first: 'jane', last: 'doE' }
          ]
        }
      };
      hookFind = {
        type: 'after',
        method: 'find',
        result: [
          { first: 'John', last: 'DOE' },
          { first: 'jane', last: 'doE' }
        ]
      };
    });

    it('updates hook before::create', () => {
      capitalize('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      capitalize('first', 'last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      capitalize('first', 'last')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('updates hook after', () => {
      capitalize('first', 'last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe' });
    });

    it('does not throw if field is missing', () => {
      const hook: any = { type: 'before', method: 'create', data: { last: 'Doe' } };
      capitalize('first', 'last')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: undefined, last: 'doe' } };
      capitalize('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: undefined, last: 'Doe' });
    });

    it('does not throw if field is null', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: null, last: 'doe' } };
      capitalize('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: null, last: 'Doe' });
    });

    it('throws if field is not a string', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: 1, last: 'doe' } };
      assert.throws(() => { capitalize('first', 'last')(hook); });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        data: { empl: { name: { first: 'john', last: 'doE' }, status: 'aa' }, dept: 'ACCT' }
      };
    });

    it('prop with no dots', () => {
      capitalize('dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'john', last: 'doE' }, status: 'aa' }, dept: 'Acct' }
      );
    });

    it('prop with 1 dot', () => {
      capitalize('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'john', last: 'doE' }, status: 'Aa' }, dept: 'ACCT' }
      );
    });

    it('prop with 2 dots', () => {
      capitalize('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'doE' }, status: 'aa' }, dept: 'ACCT' }
      );
    });

    it('ignores bad or missing paths', () => {
      capitalize('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'john', last: 'doE' }, status: 'aa' }, dept: 'ACCT' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      capitalize('xx')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'john', last: 'doE' }, status: 'aa' }, dept: 'ACCT' }
      );
    });
  });
});
