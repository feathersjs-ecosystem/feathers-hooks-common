import { assert } from 'chai';
import { alterItems } from '../../src';

let hookBefore: any;
let hookAfter: any;
let hookFindPaginate: any;
let hookCreateMulti: any;
let hookFind: any;

describe('services alterItems', () => {
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
    hookCreateMulti = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' }
      ]
    };
  });

  it('default func is a no-op', () => {
    // @ts-ignore
    alterItems()(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe' });
  });

  it('context is 2nd param', () => {
    let contextParam;
    alterItems((_rec: any, context: any) => { contextParam = context; })(hookBefore);
    assert.deepEqual(contextParam, hookBefore);
  });

  it('throws if 1st param is not a func', () => {
    try {
      // @ts-ignore
      alterItems('no-func');
    } catch (error) {
      // @ts-ignore
      assert.equal(error.message, 'Function required. (alter)');
      return;
    }
    throw new Error('alterItems does not throw an error if 1st param is not a function');
  });

  it('updates hook before::create', () => {
    alterItems((rec: any) => { rec.state = 'UT'; })(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
  });

  it('updates hook before::create::multi', () => {
    alterItems((rec: any) => { rec.state = 'UT'; })(hookCreateMulti);
    assert.deepEqual(hookCreateMulti.data, [
      { first: 'John', last: 'Doe', state: 'UT' },
      { first: 'Jane', last: 'Doe', state: 'UT' }
    ]);
  });

  it('updates hook after::find with pagination', () => {
    alterItems((rec: any) => { delete rec.last; })(hookFindPaginate);
    assert.deepEqual(hookFindPaginate.result.data, [
      { first: 'John' },
      { first: 'Jane' }
    ]);
  });

  it('updates hook after::find with no pagination', () => {
    alterItems((rec: any) => { rec.new = rec.first; })(hookFind);
    assert.deepEqual(hookFind.result, [
      { first: 'John', last: 'Doe', new: 'John' },
      { first: 'Jane', last: 'Doe', new: 'Jane' }
    ]);
  });

  it('updates hook after', () => {
    alterItems((rec: any) => { rec.new = rec.first; })(hookAfter);
    assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
  });

  it('updates hook before::create with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, rec, { state: 'UT' }))(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
  });

  it('updates hook after::find with pagination with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, { first: rec.first }))(hookFindPaginate);
    assert.deepEqual(hookFindPaginate.result.data, [
      { first: 'John' },
      { first: 'Jane' }
    ]);
  });

  it('updates hook after::find with pagination with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, rec, { new: rec.first }))(hookFind);
    assert.deepEqual(hookFind.result, [
      { first: 'John', last: 'Doe', new: 'John' },
      { first: 'Jane', last: 'Doe', new: 'Jane' }
    ]);
  });

  it('updates hook after with new item returned', () => {
    alterItems((rec: any) => Object.assign({}, rec, { new: rec.first }))(hookAfter);
    assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
  });

  it('returns a promise that contains context', async () => {
    const promise = alterItems((rec: any) => {
      rec.state = 'UT';
      return Promise.resolve();

    })(hookBefore);

    assert.ok(promise instanceof Promise);

    const result = await promise;

    assert.deepEqual(result, hookBefore);
  });

  it('updates hook before::create with new item returned', () => {
    // @ts-ignore
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, rec, { state: 'UT' })))(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  it('updates hook before::create async', () => {
    const alterFunc = (rec: any) => {
      rec.state = 'UT';
      return Promise.resolve();
    };
    // @ts-ignore
    return alterItems(alterFunc)(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  it('updates hook before::create async with new item returned', () => {
    const alterFunc = (rec: any) => Promise.resolve(Object.assign({}, rec, { state: 'UT' }));
    // @ts-ignore
    return alterItems(alterFunc)(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  it('updates hook after::create', () => {
    return alterItems((rec: any) => {
      rec.new = rec.first;
      return Promise.resolve();
      // @ts-ignore
    })(hookAfter).then(() => {
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
    });
  });

  it('updates hook after::create with new item returned', () => {
    // @ts-ignore
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, rec, { new: rec.first })))(hookAfter).then(() => {
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
    });
  });

  it('updates hook after::find with pagination', () => {
    return alterItems((rec: any) => {
      delete rec.last;
      return Promise.resolve();
      // @ts-ignore
    })(hookFindPaginate).then(() => {
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });
  });

  it('updates hook after::find with no pagination', () => {
    return alterItems((rec: any) => {
      rec.new = rec.first;
      return Promise.resolve();
      // @ts-ignore
    })(hookFind).then(() => {
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe', new: 'John' },
        { first: 'Jane', last: 'Doe', new: 'Jane' }
      ]);
    });
  });

  it('updates hook after::find with pagination with new item returned', () => {
    // @ts-ignore
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, { first: rec.first })))(hookFindPaginate).then(() => {
      assert.deepEqual(hookFindPaginate.result.data, [
        { first: 'John' },
        { first: 'Jane' }
      ]);
    });
  });

  it('updates hook after::find with no pagination with new item returned', () => {
    // @ts-ignore
    return alterItems((rec: any) => Promise.resolve(Object.assign({}, rec, { new: rec.first })))(hookFind).then(() => {
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe', new: 'John' },
        { first: 'Jane', last: 'Doe', new: 'Jane' }
      ]);
    });
  });
});
