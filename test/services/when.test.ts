import { HookContext } from '@feathersjs/feathers';
import { assert } from 'chai';
import { when } from '../../src';
import { isPromise } from '../../src/helpers';

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
  return true;
};

const predicateSync2 = (options: any) => (hook: any) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return true;
};

const predicateAsync = (hook: HookContext) => {
  predicateHook = clone(hook);
  return new Promise<true>(resolve => resolve(true));
};

const predicateAsync2 = (options: any) => (hook: HookContext) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return new Promise(resolve => resolve(true));
};

const predicateAsyncFunny = (hook: HookContext) => {
  predicateHook = clone(hook);
  return new Promise<string>(resolve => {
    predicateValue = 'abc';
    return resolve(predicateValue);
  });
};

const hookFcnSync = (hook: HookContext) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook: HookContext) => new Promise<HookContext>(resolve => {
  hookFcnAsyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

const hookFcn = (hook: any) => {
  hookFcnCalls = +1;

  return hook;
};

describe('services when - sync predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if truthy non-function', () => {
    // @ts-ignore
    when('a', hookFcnSync)(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if falsey non-function', () => {
    // @ts-ignore
    const result = when('', hookFcnSync)(hook);

    if (isPromise(result)) {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls sync hook function if sync predicate truthy', () => {
    // @ts-ignore
    when(() => 'a', hookFcnSync)(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if sync predicate falsey', () => {
    // @ts-ignore
    const result = when(() => '', hookFcnSync)(hook);

    if (isPromise(result)) {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });
});

describe('services when - sync predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if sync predicate truthy', (done: any) => {
    // @ts-ignore
    const result = when(true, hookFcnAsync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });

  it('does not call async hook function if sync predicate falsey', () => {
    const result = when(false, hookFcnAsync)(hook);

    if (isPromise(result)) {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnAsyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls async hook function if sync predicate returns truthy', (done: any) => {
    const result = when(() => true, hookFcnAsync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });
});

describe('services when - async predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if async predicate truthy', (done: any) => {
    const result = when(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });

  it('does not call sync hook function if async predicate falsey', (done: any) => {
    const result = when(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnSyncCalls, 0);
        assert.deepEqual(hook, hookBefore);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });
});

describe('services when - async predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if async predicate truthy', (done: any) => {
    const result = when(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');
    }
  });

  it('does not call async hook function if async predicate falsey', (done: any) => {
    const result = when(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.deepEqual(hook, hookBefore);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');
    }
  });
});

describe('services when - sync predicate', () => {
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
    // @ts-ignore
    when(() => 'a', hookFcnSync)(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('is passed hook as param', () => {
    when(predicateSync, hookFcnSync)(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('a higher order predicate can pass more options', () => {
    when(predicateSync2({ z: 'z' }), hookFcnSync)(hook)
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

describe('services when - async predicate', () => {
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

  it('is passed hook as param', (done: any) => {
    // @ts-ignore
    const result = when(predicateAsync, hookFcnSync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });

  it('is resolved', (done: any) => {
    // @ts-ignore
    const result = when(predicateAsyncFunny, hookFcnSync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        assert.equal(predicateValue, 'abc');

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });

  it('a higher order predicate can pass more options', (done: any) => {
    // @ts-ignore
    const result = when(predicateAsync2({ y: 'y' }), hookFcnSync)(hook);

    if (isPromise(result)) {
      result.then((result1: any) => {
        assert.deepEqual(predicateOptions, { y: 'y' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

    }
  });
});

describe('services when - runs multiple hooks', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('runs successfully', (done: any) => {
    when(true, hookFcnSync, hookFcnAsync, hookFcn)(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('runs successfully with the array syntax', (done: any) => {
    // @ts-ignore
    when(true, [hookFcnSync, hookFcnAsync, hookFcn])(hook)
      // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
  });
});

// Helpers

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
