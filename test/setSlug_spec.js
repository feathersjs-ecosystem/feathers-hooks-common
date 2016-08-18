
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooksCommon = require('../lib/index');

var hook;

describe('setSlug', () => {
  beforeEach(() => {
    hook = { type: 'before', method: 'create', params: { provider: 'rest', query: { a: 'a' } } };
  });

  describe('ignore feathers-socketio & feathers-rest clients', () => {
    it('ignore feathers-socketio', () => {
      hook.params.provider = 'socketio';
      hooksCommon.setSlug('stockId')(hook);
      assert.deepEqual(hook.params.query, { a: 'a' });
    });

    it('ignore feathers-rest', () => {
      hook.params.storeId = ':storeId';
      hooksCommon.setSlug('stockId')(hook);
      assert.deepEqual(hook.params.query, { a: 'a' });
    });
  });

  describe('handles raw HTTP clients', () => {
    it('copies slug to query', () => {
      hook.params.storeId = '123';
      hooksCommon.setSlug('storeId')(hook);
      assert.deepEqual(hook.params.query, { a: 'a', storeId: '123' });
    });
  });
});
