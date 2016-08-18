
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooks = require('../lib/index');

var hookBefore;
var hookAfter;
var hookFindPaginate;
var hookFind;

describe('pluck', () => {
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
      hooks.pluck('last')(hookBefore);
      assert.deepEqual(hookBefore.data, { last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      hooks.pluck('first')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' },
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      hooks.pluck('first')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'John' },
        { first: 'Jane' },
      ]);
    });

    it('updates hook after', () => {
      hooks.pluck('first')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('does not update when called internally on server', () => {
      hookAfter.params.provider = '';
      hooks.pluck('last')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe' });
    });

    it('does not throw if field is missing', () => {
      const hook = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
      hooks.pluck('last', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: undefined, last: undefined } };
      hooks.pluck('first')(hook);
      assert.deepEqual(hook.data, {}); // todo note this
    });

    it('does not throw if field is null', () => {
      const hook = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: null, last: null } };
      hooks.pluck('last')(hook);
      assert.deepEqual(hook.data, { last: null });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      };
    });

    it('prop with no dots', () => {
      hooks.pluck('empl')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('prop with 1 dot', () => {
      hooks.pluck('empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { status: 'AA' }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      hooks.pluck('empl.name.last', 'empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('overlapping fields', () => {
      hooks.pluck('empl.name.last', 'empl', 'empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('ignores bad or missing paths', () => {
      hooks.pluck('empl.xx.first', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { dept: 'Acct' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      hooks.pluck('xx', 'empl')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });
  });

  describe('dynamic decision sync', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });

    it('updates when true', () => {
      hooks.pluck('first', () => true)(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John' });
    });

    it('does not update when false', () => {
      hooks.pluck('xx', () => false)(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
    });
  });

  describe('dynamic decision with Promise', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' } };
    });

    it('updates when true', (next) => {
      hooks.pluck('last',
        () => new Promise(resolve => resolve(true))
        )(hookBefore)
        .then(() => {
          assert.deepEqual(hookBefore.data, { last: 'Doe' });
          next();
        });
    });

    it('does not update when false', (next) => {
      hooks.pluck('',
        () => new Promise(resolve => resolve(false))
        )(hookBefore)
        .then(() => {
          assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
          next();
        });
    });
  });
});
