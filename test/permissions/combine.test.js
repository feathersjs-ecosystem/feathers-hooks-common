if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import permissions from '../../src/permissions';

const permissionFalse = () => (hook) => {
  hook.data.callers.push('permissionFalse');
  return false;
};

const permissionTrue1 = () => (hook) => {
  hook.data.callers.push('permissionTrue1');
  return true;
};

const permissionTrue2 = () => (hook) => {
  hook.data.callers.push('permissionTrue2');
  return true;
};

const permissionTrue3 = () => (hook) => {
  hook.data.callers.push('permissionTrue3');
  return true;
};

describe('permissions combine', () => {
  let hook;

  beforeEach(() => {
    hook = { data: { a: 'a', callers: [] } };
  });

  it('returns false from 1 permission', () => {
    return permissions.combine(
      permissionFalse()
    )(hook)
      .then(result => {
        assert.deepEqual(hook,
          { data: { a: 'a', callers: ['permissionFalse'] } }
        );
        assert.strictEqual(result, false);
      });
  });

  it('returns true from 1 permission', () => {
    return permissions.combine(
      permissionTrue1()
    )(hook)
      .then(result => {
        assert.deepEqual(hook,
          { data: { a: 'a', callers: ['permissionTrue1'] } }
        );
        assert.strictEqual(result, true);
      });
  });

  it('returns true if all permissions are true', () => {
    return permissions.combine(
      permissionTrue1(), permissionTrue3(), permissionTrue2()
    )(hook)
      .then(result => {
        assert.deepEqual(hook.data.callers.sort(),
          ['permissionTrue1', 'permissionTrue2', 'permissionTrue3']
        );
        assert.strictEqual(result, true);
      });
  });

  it('returns false if any permission is false', () => {
    return permissions.combine(
      permissionTrue1(), permissionTrue3(), permissionFalse(), permissionTrue2()
    )(hook)
      .then(result => {
        assert.deepEqual(hook.data.callers.sort(),
          ['permissionFalse', 'permissionTrue1', 'permissionTrue2', 'permissionTrue3']
        );
        assert.strictEqual(result, false);
      });
  });
});
