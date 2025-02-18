import { assert } from 'vitest';
import { omitQuery } from './omit-query';

let hookBefore: any;
let hookAfter: any;

describe('omitQuery', () => {
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
      omitQuery('last')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John' } });
    });

    it('throws on hook after', () => {
      assert.throws(() => {
        omitQuery('last')(hookAfter);
      });
    });

    it('does not throw if field is missing', () => {
      omitQuery('x', 'first')(hookBefore);
      assert.deepEqual(hookBefore.params.query, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: {
          query: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
        },
      };
    });

    it('prop with no dots', () => {
      omitQuery('dept')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      });
    });

    it('prop with 1 dot', () => {
      omitQuery('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' } },
        dept: 'Acct',
      });
    });

    it('prop with 2 dots', () => {
      omitQuery('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      omitQuery('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing no dot path', () => {
      omitQuery('xx')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });
  });
});
