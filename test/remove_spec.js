
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooks = require('../lib/index');

var hookBefore;
var hookAfter;
var hookFindPaginate;
var hookFind;

describe('remove', () => {
  describe('no dynamic decision', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
      hookAfter = { type: 'after', method: 'create', params: { provider: 'rest' },
        result: { first: 'Jane', last: 'Doe' } };
      hookFindPaginate = { type: 'after', method: 'find', params: { provider: 'rest' }, result: {
        total: 2,
        data: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      } };
      hookFind = {
        type: 'after', method: 'find', params: { provider: 'rest' }, result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      };
    });

    it('updates hook before::create', () => {
      hooks.remove('first')(hookBefore);
      assert.deepEqual(hookBefore.data, { last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      hooks.remove('last')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' },
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      hooks.remove('last')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'John' },
        { first: 'Jane' },
      ]);
    });

    it('updates hook after', () => {
      hooks.remove('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('does not update when called internally on server', () => {
      hookAfter.params.provider = '';
      hooks.remove('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe' });
    });

    it('does not throw if field is missing', () => {
      const hook = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
      hooks.remove('first', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: undefined, last: 'Doe' } };
      hooks.remove('first')(hook);
      assert.deepEqual(hook.data, { first: undefined, last: 'Doe' }); // todo note this
    });

    it('does not throw if field is null', () => {
      const hook = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: null, last: 'Doe' } };
      hooks.remove('first')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      };
    });

    it('prop with no dots', () => {
      hooks.remove('dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('prop with 1 dot', () => {
      hooks.remove('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      hooks.remove('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing paths', () => {
      hooks.remove('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      hooks.remove('xx')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });
  });

  describe('dynamic decision sync', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });

    it('updates when true', () => {
      hooks.remove('last', () => true)(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John' });
    });

    it('does not update when false', () => {
      hooks.remove('first', 'last', () => false)(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
    });
  });

  describe('dynamic decision with Promise', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });

    it('updates when true', (next) => {
      hooks.remove('first',
        () => new Promise(resolve => resolve(true))
        )(hookBefore)
        .then(() => {
          assert.deepEqual(hookBefore.data, { last: 'Doe' });
          next();
        });
    });

    it('does not update when false', (next) => {
      hooks.remove('first', 'last',
        () => new Promise(resolve => resolve(false))
        )(hookBefore)
        .then(() => {
          assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
          next();
        });
    });
  });
});
