import { assert } from 'vitest';
import { alterData } from './alter-data';

let hookBefore: any;
let hookCreateMulti: any;

describe('alterData', () => {
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: { first: 'John', last: 'Doe' },
    };
    hookCreateMulti = {
      type: 'before',
      method: 'create',
      params: { provider: 'rest' },
      data: [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doe' },
      ],
    };
  });

  it('context is 2nd param', () => {
    let contextParam;
    alterData((_rec: any, context: any) => {
      contextParam = context;
    })(hookBefore);
    assert.deepEqual(contextParam, hookBefore);
  });

  it('updates hook before::create', () => {
    alterData((rec: any) => {
      rec.state = 'UT';
    })(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
  });

  it('updates hook before::create::multi', () => {
    alterData((rec: any) => {
      rec.state = 'UT';
    })(hookCreateMulti);
    assert.deepEqual(hookCreateMulti.data, [
      { first: 'John', last: 'Doe', state: 'UT' },
      { first: 'Jane', last: 'Doe', state: 'UT' },
    ]);
  });

  it('updates hook before::create with new item returned', () => {
    alterData((rec: any) => Object.assign({}, rec, { state: 'UT' }))(hookBefore);
    assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
  });

  it('returns a promise that contains context', async () => {
    const promise = alterData((rec: any) => {
      rec.state = 'UT';
      return Promise.resolve();
    })(hookBefore);

    assert.ok(promise instanceof Promise);

    const result = await promise;

    assert.deepEqual(result, hookBefore);
  });

  it('updates hook before::create with new item returned', () => {
    // @ts-ignore
    return alterData((rec: any) => Promise.resolve(Object.assign({}, rec, { state: 'UT' })))(
      hookBefore,
    ).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  it('updates hook before::create async', () => {
    const alterFunc = (rec: any) => {
      rec.state = 'UT';
      return Promise.resolve();
    };
    // @ts-ignore
    return alterData(alterFunc)(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });

  it('updates hook before::create async with new item returned', () => {
    const alterFunc = (rec: any) => Promise.resolve(Object.assign({}, rec, { state: 'UT' }));
    // @ts-ignore
    return alterData(alterFunc)(hookBefore).then(() => {
      assert.deepEqual(hookBefore.data, { first: 'John', last: 'Doe', state: 'UT' });
    });
  });
});
