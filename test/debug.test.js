
/* eslint  no-shadow: 0, no-var: 0 */

const hooksCommon = require('../lib/index');

var hook;

describe('debug', () => {
  it('does not crash', () => {
    hook = {
      type: 'before',
      method: 'create',
      data: { a: 'a' },
      params: { query: { b: 'b' } },
      result: { c: 'c' },
    };
    hooksCommon.debug('my message')(hook);
  });
});
