
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');
const hooksCommon = require('../../lib');

const isNot = hooks.isNot;
const isProvider = hooksCommon.isProvider;

let hookServer;

let hook;
let hookBefore;
let hookAfter;
let hookFcnSyncCalls;
let predicateCalls;

const predicateSync = (value) => () => {
  predicateCalls = +1;
  return value;
};

const predicateAsync = (value) => () => new Promise(resolve => {
  predicateCalls = +1;
  return resolve(value);
});

const hookFcnSync = (hook) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

describe('services isNot - predicate', () => {
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    predicateCalls = 0;
  });

  it('expects a function param', () => {
    assert.throws(() => { isNot('not a function'); });
  });

  it('negates a sync function 1', () => {
    const hook = clone(hookServer);
    const result = isNot(predicateSync(true))(hook);

    assert.equal(predicateCalls, 1);
    assert.equal(result, false);
  });

  it('negates a sync function 2', () => {
    const hook = clone(hookServer);
    const result = isNot(predicateSync(false))(hook);

    assert.equal(predicateCalls, 1);
    assert.equal(result, true);
  });

  it('negates an async function 1', (done) => {
    const hook = clone(hookServer);
    isNot(predicateAsync(true))(hook)
      .then(result => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, false);
        done();
      })
      .catch(() => {
        assert.equal(true, false, 'unexpected catch');
      });
  });

  it('negates an async function 2', (done) => {
    const hook = clone(hookServer);
    isNot(predicateAsync(false))(hook)
      .then(result => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, true);
        done();
      })
      .catch(() => {
        assert.equal(true, false, 'unexpected catch');
      });
  });
});

describe('services isNot - works with iff and isProvider', () => {
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
    hooks.iff(isNot(isProvider('server')), hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

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

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
