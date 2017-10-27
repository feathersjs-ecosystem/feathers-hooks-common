
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

var hookBefore;
var hookAfter;

describe('services pluckQuery', () => {
  describe('updates query', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { query: { first: 'John', last: 'Doe' } }
      };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
    });

    it('updates hook before::create', () => {
      hooks.pluckQuery('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John', last: 'Doe' } });
    });

    it('updates hook before::create', () => {
      hooks.pluckQuery('first')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John' } });
    });

    it('throws on hook after', () => {
      assert.throws(() => { hooks.pluckQuery('last')(hookAfter); });
    });

    it('does not throw if field is missing', () => {
      hooks.pluckQuery('x', 'last')(hookBefore);
      assert.deepEqual(hookBefore.params.query, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: {
          query: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        } };
    });

    it('prop with no dots', () => {
      hooks.pluckQuery('empl')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('prop with 1 dot', () => {
      hooks.pluckQuery('empl.name', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        { empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      hooks.pluckQuery('empl.name.last', 'empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing paths', () => {
      hooks.pluckQuery('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        {}
      );
    });

    it('ignores bad or missing no dot path', () => {
      hooks.pluckQuery('xx')(hookBefore);
      assert.deepEqual(hookBefore.params.query,
        {}
      );
    });
  });
});
