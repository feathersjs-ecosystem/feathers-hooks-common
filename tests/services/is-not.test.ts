
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooksCommo... Remove this comment to see the full error message
const hooksCommon = require('../../lib');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isNot'.
const isNot = hooks.isNot;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isProvider... Remove this comment to see the full error message
const isProvider = hooksCommon.isProvider;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookServer... Remove this comment to see the full error message
let hookServer;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
let hookFcnSyncCalls;
let predicateCalls: any;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'predicateS... Remove this comment to see the full error message
const predicateSync = (value: any) => () => {
  predicateCalls = +1;
  return value;
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'predicateA... Remove this comment to see the full error message
const predicateAsync = (value: any) => () => new Promise(resolve => {
  predicateCalls = +1;
  return resolve(value);
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
const hookFcnSync = (hook: any) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services isNot - predicate', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    predicateCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('expects a function param', () => {
    assert.throws(() => { isNot('not a function'); });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('negates a sync function 1', () => {
    const hook = clone(hookServer);
    const result = isNot(predicateSync(true))(hook);

    assert.equal(predicateCalls, 1);
    assert.equal(result, false);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('negates a sync function 2', () => {
    const hook = clone(hookServer);
    const result = isNot(predicateSync(false))(hook);

    assert.equal(predicateCalls, 1);
    assert.equal(result, true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('negates an async function 1', (done: any) => {
    const hook = clone(hookServer);
    isNot(predicateAsync(true))(hook)
      .then((result: any) => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, false);
        done();
      })
      .catch(() => {
        assert.equal(true, false, 'unexpected catch');
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('negates an async function 2', (done: any) => {
    const hook = clone(hookServer);
    isNot(predicateAsync(false))(hook)
      .then((result: any) => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, true);
        done();
      })
      .catch(() => {
        assert.equal(true, false, 'unexpected catch');
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services isNot - works with iff and isProvider', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = {
      type: 'before', method: 'create', data: { first: 'John' }, params: { provider: 'rest' }
    };
    hookAfter = {
      type: 'before', method: 'create', data: { first: 'john' }, params: { provider: 'rest' }
    };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls sync hook function if truthy', () => {
    hooks.iff(isNot(isProvider('server')), hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not call sync hook function if falsey', () => {
    const result = hooks.iff(isNot(isProvider('rest')), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });
});

// Helpers

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
