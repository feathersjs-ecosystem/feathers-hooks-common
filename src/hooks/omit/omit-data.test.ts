import { assert } from 'vitest';
import { omitData } from './omit-data';

let hookBefore: any;

describe('omitData', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      };
    });

    it('updates hook before::create', () => {
      omitData('first')(hookBefore);
      assert.deepEqual(hookBefore.data, { last: 'Doe' });
    });

    it('does not throw if field is missing', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      };
      omitData('first', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('does not throw if field is null', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: null, last: 'Doe' },
      };
      omitData('first')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
      };
    });

    it('prop with no dots', () => {
      omitData('dept')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      });
    });

    it('prop with 1 dot', () => {
      omitData('empl.status')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' } },
        dept: 'Acct',
      });
    });

    it('prop with 2 dots', () => {
      omitData('empl.name.first')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      omitData('empl.xx.first')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing no dot path', () => {
      omitData('xx')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });
  });
});
