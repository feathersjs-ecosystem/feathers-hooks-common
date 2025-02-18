import { assert } from 'vitest';
import { lowercaseData } from './lowercase-data';

let hookBefore: any;

describe('lowercaseData', () => {
  describe('updates data', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('updates hook before::create', () => {
      lowercaseData('first', 'last')(hookBefore);
      assert.deepEqual(hookBefore.data, { first: 'john', last: 'doe' });
    });

    it('does not throw if field is missing', () => {
      const hook: any = { type: 'before', method: 'create', data: { last: 'Doe' } };
      lowercaseData('first', 'last')(hook);
      assert.deepEqual(hook.data, { last: 'doe' });
    });

    it('does not throw if field is undefined', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        data: { first: undefined, last: 'Doe' },
      };
      lowercaseData('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: undefined, last: 'doe' });
    });

    it('does not throw if field is null', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: null, last: 'Doe' } };
      lowercaseData('first', 'last')(hook);
      assert.deepEqual(hook.data, { first: null, last: 'doe' });
    });

    it('throws if field is not a string', () => {
      const hook: any = { type: 'before', method: 'create', data: { first: 1, last: 'Doe' } };
      assert.throws(() => {
        lowercaseData('first', 'last')(hook);
      });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      };
    });

    it('prop with no dots', () => {
      lowercaseData('dept')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'acct',
      });
    });

    it('prop with 1 dot', () => {
      lowercaseData('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'aa' },
        dept: 'Acct',
      });
    });

    it('prop with 2 dots', () => {
      lowercaseData('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'john', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      lowercaseData('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing no dot path', () => {
      lowercaseData('xx')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });
  });
});
