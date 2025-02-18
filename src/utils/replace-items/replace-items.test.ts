import { assert } from 'vitest';
import { replaceItems } from './replace-items';
import { actOnDispatch } from '../../hooks';

// Tests when context.params._actOn === 'dispatch' are in act-on.test.ts
describe('replaceItems', () => {
  let hookBefore: any;
  let hookAfter: any;
  let hookFindPaginate: any;
  let hookFind: any;

  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' } };
    hookAfter = { type: 'after', method: 'create', params: { provider: 'rest' } };
    hookFindPaginate = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      result: {
        total: 200,
        data: [],
      },
    };
    hookFind = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
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

describe('replaceItems actOnDispatch', () => {
  let hookBefore: any;
  let hookAfter: any;
  let hookFindPaginate: any;
  let hookFind: any;

  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', params: { provider: 'rest' } };
    hookAfter = { type: 'after', method: 'create', params: { provider: 'rest' } };
    hookFindPaginate = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      dispatch: {
        total: 200,
        data: [],
      },
    };
    hookFind = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
    };
  });

  it('updates hook after::create item', async () => {
    await actOnDispatch(() => replaceItems(hookAfter, { a: 1 }))(hookAfter);
    assert.deepEqual(hookAfter.dispatch, { a: 1 });
  });

  it('updates hook after::create items', async () => {
    await actOnDispatch(() => replaceItems(hookAfter, [{ a: 1 }, { b: 2 }]))(hookAfter);
    assert.deepEqual(hookAfter.dispatch, [{ a: 1 }, { b: 2 }]);
  });

  it('updates hook after::find item', async () => {
    await actOnDispatch(() => replaceItems(hookFind, { a: 1 }))(hookFind);
    assert.deepEqual(hookFind.dispatch, { a: 1 });
  });

  it('updates hook after::find items', async () => {
    await actOnDispatch(() => replaceItems(hookFind, [{ a: 1 }, { b: 2 }]))(hookFind);
    assert.deepEqual(hookFind.dispatch, [{ a: 1 }, { b: 2 }]);
  });

  it('updates hook after::find item paginated  NOTE THIS TEST NOTE THIS TEST', async () => {
    await actOnDispatch(() => replaceItems(hookFindPaginate, { a: 1 }))(hookFindPaginate);
    assert.equal(hookFindPaginate.dispatch.total, 200);
    assert.deepEqual(hookFindPaginate.dispatch.data, [{ a: 1 }]);
  });

  it('updates hook after::find items paginated', async () => {
    await actOnDispatch(() => replaceItems(hookFindPaginate, [{ a: 1 }, { b: 2 }]))(
      hookFindPaginate,
    );
    assert.equal(hookFindPaginate.dispatch.total, 200);
    assert.deepEqual(hookFindPaginate.dispatch.data, [{ a: 1 }, { b: 2 }]);
  });
});
