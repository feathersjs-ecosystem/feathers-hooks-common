
import { assert } from 'chai';
import permissions from '../../../src/permissions';

var hook;
var hookBefore;
var predicateParam1, predicateParam2, predicateParam3, predicateParam4;

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

const predicateTrue = (hook, more2, more3, more4) => {
  predicateParam1 = hook;
  predicateParam2 = more2;
  predicateParam3 = more3;
  predicateParam4 = more4;

  return true;
};

describe('permissions iffElse', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { callers: [] } };
    hook = clone(hookBefore);
  });

  describe('runs multiple permissions', () => {
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

  describe('predicate gets right params', () => {
    it('when true', () => {
      return permissions.iffElse(
        predicateTrue, [permissionTrue1(), permissionTrue3(), permissionTrue2()], null
      )(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('every passes on correct params', () => {
      return permissions.iffElse(
        permissions.every(predicateTrue), [permissionTrue1(), permissionTrue3(), permissionTrue2()], null
      )(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('some passes on correct params', () => {
      return permissions.iffElse(
        permissions.some(predicateTrue), [permissionTrue1(), permissionTrue3(), permissionTrue2()], null
      )(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
