import { assert } from 'chai';
import { discardQuery } from '../../src';
import type { HookContext } from '@feathersjs/feathers/lib';

let hookBefore: any;
let hookAfter: any;

describe('services discardQuery', () => {
  describe('updates query', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { query: { first: 'John', last: 'Doe' } },
      };
      hookAfter = { type: 'after', method: 'create', result: { first: 'Jane', last: 'Doe' } };
    });

    it('can be used as around hook', async () => {
      const context = {
        type: 'around',
        method: 'create',
        params: { query: { first: 'John', last: 'Doe' } },
      } as HookContext;
      const result = await discardQuery('last')(context, async () => 'hello');

      assert.equal(result, 'hello');
      assert.deepEqual(context.params, { query: { first: 'John' } });
    });

    it('updates hook before::create', () => {
      discardQuery('last')(hookBefore);
      assert.deepEqual(hookBefore.params, { query: { first: 'John' } });
    });

    it('throws on hook after', () => {
      assert.throws(() => {
        discardQuery('last')(hookAfter);
      });
    });

    it('does not throw if field is missing', () => {
      discardQuery('x', 'first')(hookBefore);
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
      discardQuery('dept')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      });
    });

    it('prop with 1 dot', () => {
      discardQuery('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' } },
        dept: 'Acct',
      });
    });

    it('prop with 2 dots', () => {
      discardQuery('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      discardQuery('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing no dot path', () => {
      discardQuery('xx')(hookBefore);
      assert.deepEqual(hookBefore.params.query, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });
  });
});
