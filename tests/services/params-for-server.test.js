
const {
  assert
} = require('chai');

const {
  paramsForServer
} = require('../../lib/services');

describe('services paramsToServer', () => {
  it('handles empty params', () => {
    const res = paramsForServer();
    assert.deepEqual(res, { query: { $client: {} } });
  });

  it('handles params with query only', () => {
    const res = paramsForServer({ query: { x: 'x', y: 1 } });
    assert.deepEqual(res, { query: { x: 'x', y: 1, $client: {} } });
  });

  it('copies all params without query', () => {
    const res = paramsForServer({ a: 'a', b: 1 });
    assert.deepEqual(res, { query: { $client: { a: 'a', b: 1 } } });
  });

  it('copies all params with query', () => {
    const res = paramsForServer({ query: { x: 'x', y: 1 }, a: 'a', b: 1 });
    assert.deepEqual(res, { query: { x: 'x', y: 1, $client: { a: 'a', b: 1 } } });
  });

  it('copies whitelist props', () => {
    const res = paramsForServer({ a: 'a', b: 1 }, 'a', 'b');
    assert.deepEqual(res, { query: { $client: { a: 'a', b: 1 } } });
  });

  it('ignores non whitelist props', () => {
    const res = paramsForServer({ a: 'a', b: 1 }, 'b');
    assert.deepEqual(res, { query: { $client: { b: 1 } } });
  });
});
