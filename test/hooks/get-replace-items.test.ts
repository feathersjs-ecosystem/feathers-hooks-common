
import { assert } from 'chai';
import { getItems, replaceItems } from '../../src';

// Tests when context.params._actOn === 'dispatch' are in act-on.test.ts

describe('services getItems & replaceItems', () => {
  let hookBefore: any;
  let hookAfter: any;
  let hookBeforeArray: any;
  let hookAfterArray: any;
  let hookFindPaginate: any;
  let hookFind: any;

  describe('getItems', () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' }
      };
      hookBeforeArray = {
        type: 'before',
        method: 'create',
        params: { provider: 'rest' },
        data: [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Doe' }]
      };
      hookAfter = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: { first: 'Jane2', last: 'Doe2' }
      };
      hookAfterArray = {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        result: [{ first: 'John2', last: 'Doe2' }, { first: 'Jane', last: 'Doe' }]
      };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 2,
          data: [
            { first: 'John3', last: 'Doe3' },
            { first: 'Jane3', last: 'Doe3' }
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

    it('updates hook before::create item', () => {
      const stuff = getItems(hookBefore);
      assert.deepEqual(stuff, { first: 'John', last: 'Doe' });
    });

    it('updates hook before::create items', () => {
      const stuff = getItems(hookBeforeArray);
      assert.deepEqual(stuff, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('updates hook after::create item', () => {
      const stuff = getItems(hookAfter);
      assert.deepEqual(stuff, { first: 'Jane2', last: 'Doe2' });
    });

    it('updates hook after::create items', () => {
      const stuff = getItems(hookAfterArray);
      assert.deepEqual(stuff, [
        { first: 'John2', last: 'Doe2' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('updates hook after::find item', () => {
      const stuff = getItems(hookFindPaginate);
      assert.deepEqual(stuff, [
        { first: 'John3', last: 'Doe3' },
        { first: 'Jane3', last: 'Doe3' }
      ]);
    });

    it('updates hook after::find item paginated', () => {
      const stuff = getItems(hookFind);
      assert.deepEqual(stuff, [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]);
    });

    it('does not throw on before without data', () => {
      const hookBad: any = { type: 'before', method: 'create', params: { provider: 'rest' } };
      const stuff = getItems(hookBad);
      assert.equal(stuff, undefined);
    });

    it('does not throw on after without data', () => {
      const hookBad: any = { type: 'after', method: 'find', params: { provider: 'rest' } };
      const stuff = getItems(hookBad);
      assert.equal(stuff, undefined);
    });
  });

  describe('replaceItems', () => {
    beforeEach(() => {
      hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' } };
      hookAfter = { type: 'after', method: 'create', params: { provider: 'rest' } };
      hookFindPaginate = {
        type: 'after',
        method: 'find',
        params: { provider: 'rest' },
        result: {
          total: 200,
          data: []
        }
      };
      hookFind = {
        type: 'after', method: 'find', params: { provider: 'rest' }
      };
    });

    it('updates hook before::create item', () => {
      replaceItems(hookBefore, { a: 1 });
      assert.deepEqual(hookBefore.data, { a: 1 });
    });

    it('updates hook before::create items', () => {
      replaceItems(hookBefore, [{ a: 1 }, { b: 2 }]);
      assert.deepEqual(hookBefore.data, [{ a: 1 }, { b: 2 }]);
    });

    it('updates hook after::create item', () => {
      replaceItems(hookAfter, { a: 1 });
      assert.deepEqual(hookAfter.result, { a: 1 });
    });

    it('updates hook after::create items', () => {
      replaceItems(hookAfter, [{ a: 1 }, { b: 2 }]);
      assert.deepEqual(hookAfter.result, [{ a: 1 }, { b: 2 }]);
    });

    it('updates hook after::find item', () => {
      replaceItems(hookFind, { a: 1 });
      assert.deepEqual(hookFind.result, { a: 1 });
    });

    it('updates hook after::find items', () => {
      replaceItems(hookFind, [{ a: 1 }, { b: 2 }]);
      assert.deepEqual(hookFind.result, [{ a: 1 }, { b: 2 }]);
    });

    it('updates hook after::find item paginated  NOTE THIS TEST NOTE THIS TEST', () => {
      replaceItems(hookFindPaginate, { a: 1 });
      assert.equal(hookFindPaginate.result.total, 200);
      assert.deepEqual(hookFindPaginate.result.data, [{ a: 1 }]);
    });

    it('updates hook after::find items paginated', () => {
      replaceItems(hookFindPaginate, [{ a: 1 }, { b: 2 }]);
      assert.equal(hookFindPaginate.result.total, 200);
      assert.deepEqual(hookFindPaginate.result.data, [{ a: 1 }, { b: 2 }]);
    });
  });
});
