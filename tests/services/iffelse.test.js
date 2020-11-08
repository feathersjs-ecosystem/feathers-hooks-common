
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

let hook;
let hookBefore;
let hookAfter;
let hookFcnSyncCalls;
let hookFcnAsyncCalls;
let hookFcnCalls;
let predicateParam1, predicateParam2, predicateParam3, predicateParam4;
let context;
let predicateTrueContext;
let hookFcnSyncContext;
let hookFcnAsyncContext;
let hookFcnContext;

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

const hookFcn = function (hook, cb) {
  hookFcnContext = this;

  hookFcnCalls = +1;

  return hook;
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
      return hooks.iffElse(true, [hookFcnSync, hookFcnAsync, hookFcn], null)(hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });

    it('when false', () => {
      return hooks.iffElse(false, null, [hookFcnSync, hookFcnAsync, hookFcn])(hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });
  });

  describe('predicate gets right params', () => {
    it('when true', () => {
      return hooks.iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcn], null)(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('every passes on correct params', () => {
      return hooks.iffElse(
        hooks.every(predicateTrue), [hookFcnSync, hookFcnAsync, hookFcn], null
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
        hooks.some(predicateTrue), [hookFcnSync, hookFcnAsync, hookFcn], null
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
      hookFcnContext = undefined;
    });

    it('services', () => {
      return hooks.iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcn], null).call(context, hook)
        .then(hook => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCalls, 1);
          assert.deepEqual(hook, hookAfter);

          assert.deepEqual(predicateTrueContext, { service: 'abc' });
          assert.deepEqual(hookFcnSyncContext, { service: 'abc' });
          assert.deepEqual(hookFcnAsyncContext, { service: 'abc' });
          assert.deepEqual(hookFcnContext, { service: 'abc' });
        });
    });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
