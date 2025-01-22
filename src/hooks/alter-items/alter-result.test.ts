import { assert } from 'vitest';
import { alterResult } from './alter-result';

let hookAfter: any;
let hookFindPaginate: any;
let hookFind: any;

describe('alterResult', () => {
  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: { first: 'Jane', last: 'Doe' },
    };
    hookFindPaginate = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      result: {
        total: 2,
        data: [
          { first: 'John', last: 'Doe' },
          { first: 'Jane', last: 'Doe' },
        ],
      },
    };
    hookFind = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      result: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
      ],
    };
  });

  it('updates hook after::find with pagination', () => {
    alterResult((rec: any) => {
      delete rec.last;
    })(hookFindPaginate);
    assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
  });

  it('updates hook after::find with no pagination', () => {
    alterResult((rec: any) => {
      rec.new = rec.first;
    })(hookFind);
    assert.deepEqual(hookFind.result, [
      { first: 'John', last: 'Doe', new: 'John' },
      { first: 'Jane', last: 'Doe', new: 'Jane' },
    ]);
  });

  it('updates hook after', () => {
    alterResult((rec: any) => {
      rec.new = rec.first;
    })(hookAfter);
    assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
  });

  it('updates hook after::find with pagination with new item returned', () => {
    alterResult((rec: any) => Object.assign({}, { first: rec.first }))(hookFindPaginate);
    assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
  });

  it('updates hook after::find with pagination with new item returned', () => {
    alterResult((rec: any) => Object.assign({}, rec, { new: rec.first }))(hookFind);
    assert.deepEqual(hookFind.result, [
      { first: 'John', last: 'Doe', new: 'John' },
      { first: 'Jane', last: 'Doe', new: 'Jane' },
    ]);
  });

  it('updates hook after with new item returned', () => {
    alterResult((rec: any) => Object.assign({}, rec, { new: rec.first }))(hookAfter);
    assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
  });

  it('updates hook after::create', () => {
    return alterResult((rec: any) => {
      rec.new = rec.first;
      return Promise.resolve();
      // @ts-ignore
    })(hookAfter).then(() => {
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
    });
  });

  it('updates hook after::create with new item returned', () => {
    // @ts-ignore
    return alterResult((rec: any) => Promise.resolve(Object.assign({}, rec, { new: rec.first })))(
      hookAfter,
    ).then(() => {
      assert.deepEqual(hookAfter.result, { first: 'Jane', last: 'Doe', new: 'Jane' });
    });
  });

  it('updates hook after::find with pagination', () => {
    return alterResult((rec: any) => {
      delete rec.last;
      return Promise.resolve();
      // @ts-ignore
    })(hookFindPaginate).then(() => {
      assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
    });
  });

  it('updates hook after::find with no pagination', () => {
    return alterResult((rec: any) => {
      rec.new = rec.first;
      return Promise.resolve();
      // @ts-ignore
    })(hookFind).then(() => {
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe', new: 'John' },
        { first: 'Jane', last: 'Doe', new: 'Jane' },
      ]);
    });
  });

  it('updates hook after::find with pagination with new item returned', () => {
    // @ts-ignore
    return alterResult((rec: any) => Promise.resolve(Object.assign({}, { first: rec.first })))(
      hookFindPaginate,
    ).then(() => {
      assert.deepEqual(hookFindPaginate.result.data, [{ first: 'John' }, { first: 'Jane' }]);
    });
  });

  it('updates hook after::find with no pagination with new item returned', () => {
    // @ts-ignore
    return alterResult((rec: any) => Promise.resolve(Object.assign({}, rec, { new: rec.first })))(
      hookFind,
    ).then(() => {
      assert.deepEqual(hookFind.result, [
        { first: 'John', last: 'Doe', new: 'John' },
        { first: 'Jane', last: 'Doe', new: 'Jane' },
      ]);
    });
  });
});
