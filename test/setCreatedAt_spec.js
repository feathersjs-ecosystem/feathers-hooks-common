
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooksCommon = require('../lib/index');

var hook;

describe('setCreatedAt', () => {
  describe('check field name', () => {
    beforeEach(() => {
      hook = { type: 'before', method: 'create' };
    });

    it('default field is createdAt', () => {
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.data.createdAt, Date);
    });

    it('name can be provided', () => {
      hooksCommon.setCreatedAt({ as: 'instantiatedAt' })(hook);
      assert.instanceOf(hook.data.instantiatedAt, Date);
    });
  });

  describe('before hook', () => {
    const data1 = { a: 'a' };

    it('create no data', () => {
      const hook = { type: 'before', method: 'create' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.data.createdAt, Date);
    });

    it('create with data', () => {
      const hook = { type: 'before', method: 'create', data: data1 };
      hooksCommon.setCreatedAt()(hook);
      assert.deepEqual(hook.data.a, 'a');
      assert.instanceOf(hook.data.createdAt, Date);
    });

    it('update', () => {
      const hook = { type: 'before', method: 'update' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.data.$set.createdAt, Date);
    });

    it('patch', () => {
      const hook = { type: 'before', method: 'patch' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.data.$set.createdAt, Date);
    });

    it('remove throws', () => {
      const hook = { type: 'before', method: 'remove' };
      assert.throws(() => { hooksCommon.setCreatedAt()(hook); });
    });
  });


  describe('after hook', () => {
    const result1 = { a: 'a' };

    it('create no data', () => {
      const hook = { type: 'after', method: 'create' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.result.createdAt, Date);
    });

    it('create with data', () => {
      const hook = { type: 'after', method: 'create', result: result1 };
      hooksCommon.setCreatedAt()(hook);
      assert.deepEqual(hook.result.a, 'a');
      assert.instanceOf(hook.result.createdAt, Date);
    });

    it('update', () => {
      const hook = { type: 'after', method: 'update' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.result.createdAt, Date);
    });

    it('patch', () => {
      const hook = { type: 'after', method: 'patch' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.result.createdAt, Date);
    });

    it('remove does not throw', () => {
      const hook = { type: 'after', method: 'remove' };
      hooksCommon.setCreatedAt()(hook);
      assert.instanceOf(hook.result.createdAt, Date);
    });
  });
});
