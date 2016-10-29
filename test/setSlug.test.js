import { assert } from 'chai';
import hooksCommon from '../src';

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

  describe('handles field name', () => {
    it('copies slug to query', () => {
      hook.params.storeId = '123';
      hooksCommon.setSlug('storeId', 'slugger')(hook);
      assert.equal(hook.params.slugger, '123');
    });
  });

  describe('handles field name with dot notation', () => {
    it('copies slug to query', () => {
      hook.params.storeId = '123';
      hooksCommon.setSlug('storeId', 'query.slugger')(hook);
      assert.deepEqual(hook.params.query, { a: 'a', slugger: '123' });
    });
  });
});
