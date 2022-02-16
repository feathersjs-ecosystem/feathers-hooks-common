
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

let hookBefore;
let hookAfter;
let hookFindPaginate;
let hookFind;

describe('services lowercase', () => {
  describe('updates data', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        result: {
          total: 2,
          data: [
            { first: 'John', last: 'Doe' },
            { first: 'Jane', last: 'Doe' }
          ]
        }
      };
      hookFind = {
        type: 'after',
        method: 'find',
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' }
        ]
      };
    });

    it('updates hook before::create', () => {
      hooks.lowerCase('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'john', last: 'doe' });
    });

    it('updates hook after::find with pagination', () => {
      hooks.lowerCase('first', 'last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'john', last: 'doe' },
        { first: 'jane', last: 'doe' }
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      hooks.lowerCase('first', 'last')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'john', last: 'doe' },
        { first: 'jane', last: 'doe' }
      ]);
    });

    it('updates hook after', () => {
      hooks.lowerCase('first', 'last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'jane', last: 'doe' });
    });

    it('does not throw if field is missing', () => {
      const hook = { type: 'before', method: 'create', data: { last: 'Doe' } };
      hooks.lowerCase('first', 'last')(hook);
      assert.deepEqual(hook.data, { last: 'doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook = { type: 'before', method: 'create', data: { first: undefined, last: 'Doe' } };
      hooks.lowerCase('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: undefined, last: 'doe' });
    });

    it('does not throw if field is null', () => {
      const hook = { type: 'before', method: 'create', data: { first: null, last: 'Doe' } };
      hooks.lowerCase('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: null, last: 'doe' });
    });

    it('throws if field is not a string', () => {
      const hook = { type: 'before', method: 'create', data: { first: 1, last: 'Doe' } };
      assert.throws(() => { hooks.lowerCase('first', 'last')(hook); });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      };
    });

    it('prop with no dots', () => {
      hooks.lowerCase('dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'acct' }
      );
    });

    it('prop with 1 dot', () => {
      hooks.lowerCase('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'aa' }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      hooks.lowerCase('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'john', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing paths', () => {
      hooks.lowerCase('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      hooks.lowerCase('xx')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });
  });
});
