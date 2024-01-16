import { assert } from 'vitest';
import { keepQuery } from '../../src';

let hookBefore: any;
let hookAfter: any;

describe('services keepQuery', () => {
  describe('updates query', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { query: { first: 'John', last: 'Doe' } },
      };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
    });

    it('updates hook before::create', () => {
      keepQuery('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John', last: 'Doe' } });
    });

    it('updates hook before::create', () => {
      keepQuery('first')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John' } });
    });

    it('throws on hook after', () => {
      assert.throws(() => {
        keepQuery('last')(hookAfter);
      });
    });

    it('does not throw if field is missing', () => {
      keepQuery('x', 'last')(hookBefore);
      assert.deepEqual(hookBefore.params.query, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: {
          query: {
            empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
            dept: 'Acct',
            'owner.id': 1,
            'owner.admin': false,
          },
        },
      };
    });

    it('prop with no dots', () => {
      keepQuery('empl')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      });
    });

    it('prop with 1 dot', () => {
      keepQuery('empl.name', 'dept', 'owner.id', 'owner.admin')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' } },
        dept: 'Acct',
        'owner.id': 1,
        'owner.admin': false,
      });
    });

    it('prop with 2 dots', () => {
      keepQuery('empl.name.last', 'empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      keepQuery('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {});
    });

    it('ignores bad or missing no dot path', () => {
      keepQuery('xx')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {});
    });
  });
});
