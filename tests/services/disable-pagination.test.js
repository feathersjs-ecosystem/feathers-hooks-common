
const { assert } = require('chai');

const { disablePagination } = require('../../lib/services');

let hookBefore;

describe('services disablePagination', () => {
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'find',
      params: { query: { id: 1, $limit: -1 } }
    };
  });

  it('disables on $limit = -1', () => {
    hookBefore.params.query.$limit = -1;

    const result = disablePagination()(hookBefore);
    assert.deepEqual(result.params, { paginate: false, query: { id: 1 } });
  });

  it('disables on $limit = "-1"', () => {
    hookBefore.params.query.$limit = '-1';

    const result = disablePagination()(hookBefore);
    assert.deepEqual(result.params, { paginate: false, query: { id: 1 } });
  });

  it('throws if after hook', () => {
    hookBefore.type = 'after';

    assert.throws(() => { disablePagination()(hookBefore); });
  });

  it('throws if not find', () => {
    hookBefore.method = 'get';

    assert.throws(() => { disablePagination()(hookBefore); });
  });
});
