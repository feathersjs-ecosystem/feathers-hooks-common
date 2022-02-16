
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
let hookFcnSyncCalls;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnAsy... Remove this comment to see the full error message
let hookFcnAsyncCalls;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnCal... Remove this comment to see the full error message
let hookFcnCalls;
let predicateParam1: any, predicateParam2: any, predicateParam3: any, predicateParam4: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'context'.
let context;
let predicateTrueContext: any;
let hookFcnSyncContext: any;
let hookFcnAsyncContext: any;
let hookFcnContext: any;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
const hookFcnSync = function(this: any, hook: any) {
  hookFcnSyncContext = this;

  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnAsy... Remove this comment to see the full error message
const hookFcnAsync = function(this: any, hook: any) {
  hookFcnAsyncContext = this;

  return new Promise(resolve => {
    hookFcnAsyncCalls = +1;
    hook.data.first = hook.data.first.toLowerCase();

    resolve(hook);
  });
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcn'.
const hookFcn = function(this: any, hook: any, cb: any) {
  hookFcnContext = this;

  hookFcnCalls = +1;

  return hook;
};

const predicateTrue = function(this: any, hook: any, more2: any, more3: any, more4: any) {
  predicateTrueContext = this;

  predicateParam1 = hook;
  predicateParam2 = more2;
  predicateParam3 = more3;
  predicateParam4 = more4;

  return true;
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iffElse', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('runs single hook', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when true', () => {
      return hooks.iffElse(true, hookFcnSync, hookFcnAsync)(hook)
        .then((hook: any) => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 0);
          assert.deepEqual(hook, hookAfter);
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when false', () => {
      return hooks.iffElse(false, hookFcnSync, hookFcnAsync)(hook)
        .then((hook: any) => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 0);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('runs multiple hooks', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when true', () => {
      return hooks.iffElse(true, [hookFcnSync, hookFcnAsync, hookFcn], null)(hook)
        .then((hook: any) => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when false', () => {
      return hooks.iffElse(false, null, [hookFcnSync, hookFcnAsync, hookFcn])(hook)
        .then((hook: any) => {
          assert.deepEqual(hook, hookAfter);
          assert.equal(hookFcnSyncCalls, 1);
          assert.equal(hookFcnAsyncCalls, 1);
          assert.equal(hookFcnCalls, 1);
          assert.deepEqual(hook, hookAfter);
        });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('predicate gets right params', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('when true', () => {
      return hooks.iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcn], null)(hook)
        .then(() => {
          assert.deepEqual(predicateParam1, hook, 'param1');
          assert.strictEqual(predicateParam2, undefined, 'param2');
          assert.strictEqual(predicateParam3, undefined, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('predicate and hooks get right context', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      context = { service: 'abc' };
      predicateTrueContext = undefined;
      hookFcnSyncContext = undefined;
      hookFcnAsyncContext = undefined;
      hookFcnContext = undefined;
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('services', () => {
      return hooks.iffElse(predicateTrue, [hookFcnSync, hookFcnAsync, hookFcn], null).call(context, hook)
        .then((hook: any) => {
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
