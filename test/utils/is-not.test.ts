import { assert } from 'chai';
import { iff, isNot, isProvider } from '../../src';
import { isPromise } from '../../src/common';

let hookServer: any;
let hook: any;
let hookBefore: any;
let hookAfter: any;
let hookFcnSyncCalls: any;
let predicateCalls: any;

const predicateSync = (value: any) => () => {
  predicateCalls = +1;
  return value;
};

const predicateAsync =
  <T>(value: T) =>
  () =>
    new Promise<T>(resolve => {
      predicateCalls = +1;
      return resolve(value);
    });

const hookFcnSync = (hook: any) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

describe('util isNot - predicate', () => {
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    predicateCalls = 0;
  });

  it('expects a function param', () => {
    // @ts-expect-error
    assert.throws(() => {
      isNot('not a function');
    });
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

  it('negates an async function 1', (done: any) => {
    const hook = clone(hookServer);

    isNot(predicateAsync(true))(hook)
      // @ts-ignore
      .then((result: any) => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, false);
        done();
      })
      .catch(() => {
        assert.equal(true, false, 'unexpected catch');
      });
  });

  it('negates an async function 2', (done: any) => {
    const hook = clone(hookServer);
    isNot(predicateAsync(false))(hook)
      // @ts-ignore
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

describe('services isNot - works with iff and isProvider', () => {
  beforeEach(() => {
    hookBefore = {
      type: 'before',
      method: 'create',
      data: { first: 'John' },
      params: { provider: 'rest' },
    };
    hookAfter = {
      type: 'before',
      method: 'create',
      data: { first: 'john' },
      params: { provider: 'rest' },
    };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
  });

  it('calls sync hook function if truthy', () => {
    iff(
      isNot(isProvider('server')),
      hookFcnSync
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if falsey', () => {
    const result = iff(isNot(isProvider('rest')), hookFcnSync)(hook);

    if (isPromise(result)) {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });
});

// Helpers

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
