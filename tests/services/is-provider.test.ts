
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');

const isProvider = hooks.isProvider;

let hookServer;
let hookSocketio;

let hook;
let hookBefore;
let hookAfter;
let hookFcnSyncCalls;

const hookFcnSync = (hook) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

describe('services isProvider - predicate', () => {
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    hookSocketio = { type: 'before', method: 'create', params: { provider: 'socketio' } };
  });

  it('returns a function', () => {
    const fcn = isProvider('server');

    assert.isFunction(fcn);
  });

  it('gets passed the hook', () => {
    const hook = clone(hookServer);
    const result = isProvider('server')(hook);

    assert.equal(result, true);
  });

  it('throws on no args', () => {
    assert.throws(() => isProvider());
  });

  it('finds provider with 1 arg', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('socketio')(hook);

    assert.equal(result, true);
  });

  it('finds provider with 2 args', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('rest', 'socketio')(hook);

    assert.equal(result, true);
  });

  it('finds server', () => {
    const hook = clone(hookServer);
    const result = isProvider('rest', 'socketio', 'server')(hook);

    assert.equal(result, true);
  });

  it('finds external', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('rest', 'server', 'external')(hook);

    assert.equal(result, true);
  });

  it('fails properly if not provider', () => {
    const hook = clone(hookServer);
    const result = isProvider('socketio')(hook);

    assert.equal(result, false);
  });

  it('fails properly if not external', () => {
    const hook = clone(hookServer);
    const result = isProvider('external')(hook);

    assert.equal(result, false);
  });

  it('fails properly if not server', () => {
    const hook = clone(hookSocketio);
    const result = isProvider('server')(hook);

    assert.equal(result, false);
  });
});

describe('services isProvider - works with iff', () => {
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

  it('calls sync hook function if truthy', () => {
    hooks.iff(isProvider('rest'), hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

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

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
