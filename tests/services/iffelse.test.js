
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

var hook;
var hookBefore;
var hookAfter;
var hookFcnSyncCalls;
var hookFcnAsyncCalls;
var hookFcnCbCalls;
var predicateParam1, predicateParam2, predicateParam3, predicateParam4;
var context;
var predicateTrueContext;
var hookFcnSyncContext;
var hookFcnAsyncContext;
var hookFcnCbContext;

const hookFcnSync = function (hook) {
  hookFcnSyncContext = this;

  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = function (hook) {
  hookFcnAsyncContext = this;

  return new Promise(resolve => {
    hookFcnAsyncCalls = +1;
    hook.data.first = hook.data.first.toLowerCase();

    resolve(hook);
  });
};

const hookFcnCb = function (hook, cb) {
  hookFcnCbContext = this;

  hookFcnCbCalls = +1;
  cb(null, hook);
};

const predicateTrue = function (hook, more2, more3, more4) {
  predicateTrueContext = this;

  predicateParam1 = hook;
  predicateParam2 = more2;
  predicateParam3 = more3;
  predicateParam4 = more4;

  return true;
};

describe('services iffElse', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  describe('runs single hook', () => {
    it('when true', () => {
      return hooks.iffElse(true, hookFcnSync, hookFcnAsync)(hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 0);
          assert.deepEqual(hook, hookAfter);
        });
    });

    it('when false', () => {
      return hooks.iffElse(false, hookFcnSync, hookFcnAsync)(hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 0);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });
  });

  describe('runs multiple hooks', () => {
    it('when true', () => {
      return hooks.iffElse(true, [hookFcnSync, hookFcnAsync, hookFcnCb], null)(hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCbCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });

    it('when false', () => {
      return hooks.iffElse(false, null, [hookFcnSync, hookFcnAsync, hookFcnCb])(hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCbCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });
  });

  describe('predicate gets right params', () => {
    it('when true', () => {
      return hooks.iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcnCb], null)(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('every passes on correct params', () => {
      return hooks.iffElse(
        hooks.every(predicateTrue), [hookFcnSync, hookFcnAsync, hookFcnCb], null
      )(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('some passes on correct params', () => {
      return hooks.iffElse(
        hooks.some(predicateTrue), [hookFcnSync, hookFcnAsync, hookFcnCb], null
      )(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });
  });

  describe('predicate and hooks get right context', () => {
    beforeEach(() => {
      context = { service: 'abc' };
      predicateTrueContext = undefined;
      hookFcnSyncContext = undefined;
      hookFcnAsyncContext = undefined;
      hookFcnCbContext = undefined;
    });

    it('services', () => {
      return hooks.iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcnCb], null).call(context, hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCbCalls, 1);
          assert.deepEqual(hook, hookAfter);

          assert.deepEqual(predicateTrueContext, { service: 'abc' });
          assert.deepEqual(hookFcnSyncContext, { service: 'abc' });
          assert.deepEqual(hookFcnAsyncContext, { service: 'abc' });
          assert.deepEqual(hookFcnCbContext, { service: 'abc' });
        });
    });
  });
});

// Helpers

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
