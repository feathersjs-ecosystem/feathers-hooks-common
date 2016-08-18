
/* eslint  no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooksCommon = require('../lib/index');

var hook;

describe('setUpdatedAt', () => {
  describe('check field name', () => {
    beforeEach(() => {
      hook = { type: 'before', method: 'create' };
    });

    it('default field is updatedAt', () => {
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.data.updatedAt, Date);
    });

    it('name can be provided', () => {
      hooksCommon.setUpdatedAt({ as: 'modifiedAt' })(hook);
      assert.instanceOf(hook.data.modifiedAt, Date);
    });
  });

  describe('before hook', () => {
    const data1 = { a: 'a' };

    it('create no data', () => {
      const hook = { type: 'before', method: 'create' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.data.updatedAt, Date);
    });

    it('create with data', () => {
      const hook = { type: 'before', method: 'create', data: data1 };
      hooksCommon.setUpdatedAt()(hook);
      assert.deepEqual(hook.data.a, 'a');
      assert.instanceOf(hook.data.updatedAt, Date);
    });

    it('update', () => {
      const hook = { type: 'before', method: 'update' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.data.$set.updatedAt, Date);
    });

    it('patch', () => {
      const hook = { type: 'before', method: 'patch' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.data.$set.updatedAt, Date);
    });

    it('remove throws', () => {
      const hook = { type: 'before', method: 'remove' };
      assert.throws(() => { hooksCommon.setUpdatedAt()(hook); });
    });
  });


  describe('after hook', () => {
    const result1 = { a: 'a' };

    it('create no data', () => {
      const hook = { type: 'after', method: 'create' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.result.updatedAt, Date);
    });

    it('create with data', () => {
      const hook = { type: 'after', method: 'create', result: result1 };
      hooksCommon.setUpdatedAt()(hook);
      assert.deepEqual(hook.result.a, 'a');
      assert.instanceOf(hook.result.updatedAt, Date);
    });

    it('update', () => {
      const hook = { type: 'after', method: 'update' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.result.updatedAt, Date);
    });

    it('patch', () => {
      const hook = { type: 'after', method: 'patch' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.result.updatedAt, Date);
    });

    it('remove does not throw', () => {
      const hook = { type: 'after', method: 'remove' };
      hooksCommon.setUpdatedAt()(hook);
      assert.instanceOf(hook.result.updatedAt, Date);
    });
  });
});
