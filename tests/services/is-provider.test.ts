
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isProvider... Remove this comment to see the full error message
const isProvider = hooks.isProvider;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookServer... Remove this comment to see the full error message
let hookServer: any;
let hookSocketio: any;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
let hookFcnSyncCalls;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
const hookFcnSync = (hook: any) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services isProvider - predicate', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    hookSocketio = { type: 'before', method: 'create', params: { provider: 'socketio' } };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('returns a function', () => {
    const fcn = isProvider('server');

    assert.isFunction(fcn);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('gets passed the hook', () => {
    const hook = clone(hookServer);
    const result = isProvider('server')(hook);

    assert.equal(result, true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws on no args', () => {
    assert.throws(() => isProvider());
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('finds provider with 1 arg', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('socketio')(hook);

    assert.equal(result, true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('finds provider with 2 args', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('rest', 'socketio')(hook);

    assert.equal(result, true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('finds server', () => {
    const hook = clone(hookServer);
    const result = isProvider('rest', 'socketio', 'server')(hook);

    assert.equal(result, true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('finds external', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('rest', 'server', 'external')(hook);

    assert.equal(result, true);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails properly if not provider', () => {
    const hook = clone(hookServer);
    const result = isProvider('socketio')(hook);

    assert.equal(result, false);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails properly if not external', () => {
    const hook = clone(hookServer);
    const result = isProvider('external')(hook);

    assert.equal(result, false);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('fails properly if not server', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('server')(hook);

    assert.equal(result, false);
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services isProvider - works with iff', () => {
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
    hooks.iff(isProvider('rest'), hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not call sync hook function if falsey', () => {
    const result = hooks.iff(isProvider('server'), hookFcnSync)(hook);

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
