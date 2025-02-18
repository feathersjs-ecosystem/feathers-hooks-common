import type { HookContext } from '@feathersjs/feathers';
import { assert } from 'vitest';
import { unless } from './unless';
import { clone, isPromise } from '../../common';

let hook: any;
let hookBefore: any;
let hookAfter: any;
let hookFcnSyncCalls: any;
let hookFcnAsyncCalls: any;
let hookFcnCalls: any;
let predicateHook: any;
let predicateOptions: any;
let predicateValue: any;

const predicateSync = (hook: any) => {
  predicateHook = clone(hook);
  return false;
};

const predicateSync2 = (options: any) => (hook: any) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return false;
};

const predicateAsync = (hook: any) => {
  predicateHook = clone(hook);
  return new Promise<false>(resolve => resolve(false));
};

const predicateAsync2 = (options: any) => (hook: any) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return new Promise<false>(resolve => resolve(false));
};

const predicateAsyncFunny = (hook: HookContext) => {
  predicateHook = clone(hook);
  return new Promise<null>(resolve => {
    predicateValue = null;
    return resolve(predicateValue);
  });
};

const hookFcnSync = (hook: HookContext): HookContext => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook: HookContext) =>
  new Promise<HookContext>(resolve => {
    hookFcnAsyncCalls = +1;
    hook.data.first = hook.data.first.toLowerCase();

    resolve(hook);
  });

const hookFcn = (hook: HookContext): HookContext => {
  hookFcnCalls = +1;

  return hook;
};

describe('sync predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if falsey non-function', () => {
    unless(
      false,
      hookFcnSync,
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if truthy non-function', () => {
    const result = unless(true, hookFcnSync)(hook);

    if (isPromise(result)) {
      assert.fail('promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls sync hook function if sync predicate falsey', () => {
    unless(
      () => false,
      hookFcnSync,
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if sync predicate truthy', () => {
    const result = unless(() => true, hookFcnSync)(hook);

    if (isPromise(result)) {
      assert.fail('promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });
});

describe('sync predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if sync predicate falsey', async () => {
    const result = unless(false, hookFcnAsync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnAsyncCalls, 1);
      assert.deepEqual(hook, hookAfter);
    });
  });

  it('does not call async hook function if sync predicate truthy', () => {
    const result = unless(true, hookFcnAsync)(hook);

    if (isPromise(result)) {
      assert.fail('promise unexpectedly returned');
    }

    assert.deepEqual(result, hookBefore);
    assert.equal(hookFcnAsyncCalls, 0);
    assert.deepEqual(hook, hookBefore);
  });

  it('calls async hook function if sync predicate returns falsey', async () => {
    const result = unless(() => false, hookFcnAsync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnAsyncCalls, 1);
      assert.deepEqual(hook, hookAfter);
    });
  });
});

describe('async predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if aync predicate falsey', async () => {
    const result = unless(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.deepEqual(result1, hookAfter);
    });
  });

  it('does not call sync hook function if async predicate truthy', async () => {
    const result = unless(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(result1, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    });
  });
});

describe('async predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if aync predicate falsey', async () => {
    const result = unless(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnAsyncCalls, 1);
      assert.deepEqual(result1, hookAfter);
    });
  });

  it('does not call async hook function if async predicate truthy', async () => {
    const result = unless(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    result.then((result1: any) => {
      assert.deepEqual(result1, hookBefore);
      assert.equal(hookFcnAsyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    });
  });
});

describe('sync predicate', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    predicateHook = null;
    predicateOptions = null;
  });

  it('does not need to access hook', () => {
    unless(
      () => false,
      hookFcnSync,
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('is passed hook as param', () => {
    unless(
      predicateSync,
      hookFcnSync,
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('a higher order predicate can pass more options', () => {
    unless(
      predicateSync2({ z: 'z' }),
      hookFcnSync,
    )(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(predicateOptions, { z: 'z' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('async predicate', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    predicateHook = null;
    predicateOptions = null;
    predicateValue = null;
  });

  it('is passed hook as param', async () => {
    const result = unless(predicateAsync, hookFcnSync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(predicateHook, hookBefore);
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.deepEqual(result1, hookAfter);
    });
  });

  it('is resolved', async () => {
    // @ts-ignore
    const result = unless(predicateAsyncFunny, hookFcnSync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(predicateHook, hookBefore);
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.deepEqual(result1, hookAfter);

      assert.equal(predicateValue, null);
    });
  });

  it('a higher order predicate can pass more options', async () => {
    const result = unless(predicateAsync2({ y: 'y' }), hookFcnSync)(hook);

    if (!isPromise(result)) {
      assert.fail('promise unexpectedly not returned');
    }

    await result.then((result1: any) => {
      assert.deepEqual(predicateOptions, { y: 'y' });
      assert.deepEqual(predicateHook, hookBefore);
      assert.deepEqual(result1, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.deepEqual(result1, hookAfter);
    });
  });
});

describe('runs multiple hooks', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('runs successfully', async () => {
    await unless(
      false,
      hookFcnSync,
      hookFcnAsync,
      hookFcn,
    )(hook).then((hook: any) => {
      assert.deepEqual(hook, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.equal(hookFcnAsyncCalls, 1);
      assert.equal(hookFcnCalls, 1);
      assert.deepEqual(hook, hookAfter);
    });
  });
});
