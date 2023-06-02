import { assert } from 'chai';
import { disablePagination } from '../../src';
import type { HookContext } from '@feathersjs/feathers/lib';

let hookBefore: any;

describe('services disablePagination', () => {
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'find',
      params: { query: { id: 1, $limit: -1 } },
    };
  });

  it('can be used as around hook', async () => {
    const context = {
      type: 'around',
      method: 'find',
      params: { query: { id: 1, $limit: -1 } },
    } as HookContext;

    const result = await disablePagination()(context, async () => 'hello');

    assert.equal(result, 'hello');

    assert.deepStrictEqual(context.params, { paginate: false, query: { id: 1 } });
  });

  it('disables on $limit = -1', () => {
    hookBefore.params.query.$limit = -1;

    const result: any = disablePagination()(hookBefore);
    assert.deepEqual(result.params, { paginate: false, query: { id: 1 } });
  });

  it('disables on $limit = "-1"', () => {
    hookBefore.params.query.$limit = '-1';

    const result: any = disablePagination()(hookBefore);
    assert.deepEqual(result.params, { paginate: false, query: { id: 1 } });
  });

  it('throws if after hook', () => {
    hookBefore.type = 'after';

    assert.throws(() => {
      disablePagination()(hookBefore);
    });
  });

  it('throws if not find', () => {
    hookBefore.method = 'get';

    assert.throws(() => {
      disablePagination()(hookBefore);
    });
  });
});
