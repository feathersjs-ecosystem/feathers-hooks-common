import { assert } from 'vitest';
import { pickData } from './pick-data';

let hookBefore: any;

describe('pickData', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      };
    });

    it('does not throw if field is missing', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
      };
      pickData('last', 'xx')(hook);
      assert.deepEqual(hook.data, { last: 'Doe' });
    });

    it('keeps undefined values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: undefined, last: 'Doe' },
      };
      pickData('first')(hook);
      assert.deepEqual(hook.data, { first: undefined });
    });

    it('keeps null values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: null, last: 'Doe' },
      };
      pickData('first')(hook);
      assert.deepEqual(hook.data, { first: null });
    });

    it('keeps false values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: false, last: 'Doe' },
      };
      pickData('first')(hook);
      assert.deepEqual(hook.data, { first: false });
    });

    it('keeps 0 values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 0, last: 'Doe' },
      };
      pickData('first')(hook);
      assert.deepEqual(hook.data, { first: 0 });
    });

    it('keeps empty string values', () => {
      const hook: any = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: '', last: 'Doe' },
      };
      pickData('first')(hook);
      assert.deepEqual(hook.data, { first: '' });
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
      pickData('empl')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
      });
    });

    it('prop with 1 dot', () => {
      pickData('empl.name', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { first: 'John', last: 'Doe' } },
        dept: 'Acct',
      });
    });

    it('prop with 2 dots', () => {
      pickData('empl.name.last', 'empl.status', 'dept')(hookBefore);
      assert.deepEqual(hookBefore.data, {
        empl: { name: { last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
      });
    });

    it('ignores bad or missing paths', () => {
      pickData('empl.name.first', 'empl.name.surname')(hookBefore);
      assert.deepEqual(hookBefore.data, { empl: { name: { first: 'John' } } });
    });

    it('ignores bad or missing no dot path', () => {
      pickData('xx')(hookBefore);
      assert.deepEqual(hookBefore.data, {});
    });
  });

  describe('ignore non-object records', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [
          { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' },
          null,
          undefined,
          Infinity,
        ],
      };
    });

    it('before', () => {
      pickData('empl')(hookBefore);
      assert.deepEqual(hookBefore.data, [
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } },
        null,
        undefined,
        Infinity,
      ]);
    });
  });
});
