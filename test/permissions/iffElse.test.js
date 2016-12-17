if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import permissions from '../../src/permissions';

var hook;
var hookBefore;

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

describe('permissions iffElse - runs multiple permissions', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { callers: [] } };
    hook = clone(hookBefore);
  });

  it('when true', () => {
    return permissions.iffElse(true, [
      permissionTrue1(), permissionTrue3(), permissionTrue2()
    ], null)(hook)
      .then(result => {
        assert.deepEqual(hook.data.callers.sort(),
          ['permissionTrue1', 'permissionTrue2', 'permissionTrue3']
        );
        assert.strictEqual(result, true);
      });
  });

  it('when false', () => {
    return permissions.iffElse(false, null, [
      permissionTrue1(), permissionTrue3(), permissionTrue2()
    ])(hook)
      .then(result => {
        assert.deepEqual(hook.data.callers.sort(),
          ['permissionTrue1', 'permissionTrue2', 'permissionTrue3']
        );
        assert.strictEqual(result, true);
      });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
