
const { assert } = require('chai');

const hooks = require('../../lib/services');

let hookBefore;
let hookAfter;
let hookFindPaginate;
let hookFind;

describe('services keep', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' }
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { first: 'Jane', last: 'Doe' }
      };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
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
        params: { provider: 'rest' },
        result: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' }
        ]
      };
    });

    it('updates hook before::create', () => {
      hooks.keep('last')(hookBefore);
      assert.deepEqual(hookBefore.data, { last: 'Doe' });
    });

    it('updates hook after::find with pagination', () => {
      hooks.keep('first')(hookFindPaginate);
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });

    it('updates hook after::find with no pagination', () => {
      hooks.keep('first')(hookFind);
      assert.deepEqual(hookFind.result, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });

    it('updates hook after', () => {
      hooks.keep('first')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('updates when called internally on server', () => {
      hookAfter.params.provider = '';
      hooks.keep('first')(hookAfter);
      assert.deepEqual(hookAfter.result, { first: 'Jane' });
    });

    it('does not throw if field is missing', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' }
      };
      hooks.keep('last', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('keeps undefined values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: undefined, last: 'Doe' }
      };
      hooks.keep('first')(hook);
      assert.deepEqual(hook.data, { first: undefined });
    });

    it('keeps null values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: null, last: 'Doe' }
      };
      hooks.keep('first')(hook);
      assert.deepEqual(hook.data, { first: null });
    });

    it('keeps false values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: false, last: 'Doe' }
      };
      hooks.keep('first')(hook);
      assert.deepEqual(hook.data, { first: false });
    });

    it('keeps 0 values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 0, last: 'Doe' }
      };
      hooks.keep('first')(hook);
      assert.deepEqual(hook.data, { first: 0 });
    });

    it('keeps empty string values', () => {
      const hook = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: '', last: 'Doe' }
      };
      hooks.keep('first')(hook);
      assert.deepEqual(hook.data, { first: '' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      };
    });

    it('prop with no dots', () => {
      hooks.keep('empl')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('prop with 1 dot', () => {
      hooks.keep('empl.name', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      hooks.keep('empl.name.last', 'empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing paths', () => {
      hooks.keep('empl.name.first', 'empl.name.surname')(hookBefore);
      assert.deepEqual(hookBefore.data,
        { empl: { name: { first: 'John' } } }
      );
    });

    it('ignores bad or missing no dot path', () => {
      hooks.keep('xx')(hookBefore);
      assert.deepEqual(hookBefore.data, {});
    });
  });

  describe('ignore non-object records', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }, null, undefined, Infinity]
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [{ first: 'Jane', last: 'Doe' }, null, undefined, Infinity]
      };
    });

    it('before', () => {
      hooks.keep('empl')(hookBefore);
      assert.deepEqual(hookBefore.data,
        [{ empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }, null, undefined, Infinity]
      );
    });

    it('after', () => {
      hooks.keep('first')(hookAfter);
      assert.deepEqual(hookAfter.result,
        [{ first: 'Jane' }, null, undefined, Infinity]
      );
    });
  });
});
