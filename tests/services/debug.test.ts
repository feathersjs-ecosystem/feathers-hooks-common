
const hooksCommon = require('../../lib/services');

describe('services debug', () => {
  it('does not crash', () => {
    const hook = {
      type: 'before',
      method: 'create',
      data: { a: 'a' },
      params: { query: { b: 'b' } },
      result: { c: 'c' }
    };
    hooksCommon.debug('my message')(hook);
  });

  it('display params props', () => {
    const hook = {
      type: 'before',
      method: 'create',
      data: { a: 'a' },
      params: { query: { b: 'b' }, foo: 'bar' },
      result: { c: 'c' }
    };
    hooksCommon.debug('my message', 'query', 'foo')(hook);
  });
});
