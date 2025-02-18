import { assert } from 'vitest';
import { iff } from '../../hooks';
import { clone, isPromise } from '../../common';
import { not } from './not';
import { isProvider } from '../is-provider/is-provider';

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

describe('predicates/not', () => {
  beforeEach(() => {
    hookServer = { type: 'before', method: 'create', params: { provider: '' } };
    predicateCalls = 0;
  });

  it('negates a sync function 1', () => {
    const hook = clone(hookServer);
    const result = not(predicateSync(true))(hook);

    assert.equal(predicateCalls, 1);
    assert.equal(result, false);
  });

  it('negates a sync function 2', () => {
    const hook = clone(hookServer);
    const result = not(predicateSync(false))(hook);

    assert.equal(predicateCalls, 1);
    assert.equal(result, true);
  });

  it('negates an async function 1', async () => {
    const hook = clone(hookServer);

    await not(predicateAsync(true))(hook)
      // @ts-ignore
      .then((result: any) => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, false);
      })
      .catch(() => {
        assert.fail('unexpected catch');
      });
  });

  it('negates an async function 2', async () => {
    const hook = clone(hookServer);
    await not(predicateAsync(false))(hook)
      // @ts-ignore
      .then((result: any) => {
        assert.equal(predicateCalls, 1);
        assert.equal(result, true);
      })
      .catch(() => {
        assert.fail('unexpected catch');
      });
  });
});

describe('services not - works with iff and isProvider', () => {
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
      not(isProvider('server')),
      hookFcnSync,
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if falsey', () => {
    const result = iff(not(isProvider('rest')), hookFcnSync)(hook);

    if (isPromise(result)) {
      assert.fail('promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });
});
