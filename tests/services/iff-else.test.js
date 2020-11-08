
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
let predicateHook;
let predicateOptions;
let predicateValue;

const predicateSync = (hook) => {
  predicateHook = clone(hook);
  return true;
};

const predicateSync2 = (options) => (hook) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return true;
};

const predicateAsync = (hook) => {
  predicateHook = clone(hook);
  return new Promise(resolve => resolve(true));
};

const predicateAsync2 = (options) => (hook) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return new Promise(resolve => resolve(true));
};

const predicateAsyncFunny = (hook) => {
  predicateHook = clone(hook);
  return new Promise(resolve => {
    predicateValue = 'abc';
    return resolve(predicateValue);
  });
};

const hookFcnSync = (hook) => {
  hookFcnSyncCalls += 1;

  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook) => new Promise(resolve => {
  hookFcnAsyncCalls += 1;

  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

const hookCb = (hook) => {
  hookFcnCalls += 1;

  return hook;
};

describe('services iff - sync predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if truthy non-function', () => {
    return hooks.iff('a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if falsey non-function', () => {
    const result = hooks.iff('', hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls sync hook function if sync predicate truthy', () => {
    return hooks.iff(() => 'a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if sync predicate falsey', () => {
    const result = hooks.iff(() => '', hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });
});

describe('services iff - sync predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if sync predicate truthy', () => {
    return hooks.iff(true, hookFcnAsync)(hook)
      .then((result1) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call async hook function if sync predicate falsey', () => {
    const result = hooks.iff(false, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnAsyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls async hook function if sync predicate returns truthy', () => {
    return hooks.iff(() => true, hookFcnAsync)(hook)
      .then((result1) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('services iff - async predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if aync predicate truthy', () => {
    return hooks.iff(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook)
      .then(result1 => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });

  it('does not call sync hook function if async predicate falsey', () => {
    return hooks.iff(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook)
      .then(result1 => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnSyncCalls, 0);
        assert.deepEqual(hook, hookBefore);
      });
  });
});

describe('services iff - async predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if aync predicate truthy', () => {
    return hooks.iff(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook)
      .then(result1 => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });

  it('does not call async hook function if async predicate falsey', () => {
    return hooks.iff(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook)
      .then(result1 => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.deepEqual(hook, hookBefore);
      });
  });
});

describe('services iff - sync predicate', () => {
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
    return hooks.iff(() => 'a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('is passed hook as param', () => {
    return hooks.iff(predicateSync, hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('a higher order predicate can pass more options', () => {
    return hooks.iff(predicateSync2({ z: 'z' }), hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(predicateOptions, { z: 'z' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('services iff - async predicate', () => {
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

  it('is passed hook as param', () => {
    return hooks.iff(predicateAsync, hookFcnSync)(hook)
      .then(result1 => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });

  it('is resolved', () => {
    return hooks.iff(predicateAsyncFunny, hookFcnSync)(hook)
      .then(result1 => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        assert.equal(predicateValue, 'abc');
      });
  });

  it('a higher order predicate can pass more options', () => {
    return hooks.iff(predicateAsync2({ y: 'y' }), hookFcnSync)(hook)
      .then(result1 => {
        assert.deepEqual(predicateOptions, { y: 'y' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });
});

describe('services iff - runs .else()', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  it('using iff(true, ...)', () => {
    return hooks.iff(true,
      hookFcnSync,
      hookFcnSync,
      hookFcnSync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('using if(false).else(...)', () => {
    return hooks.iff(false,
      hookFcnSync
    )
      .else(
        hookFcnSync,
        hookFcnSync,
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('using if(false).else(...) with the array syntax', () => {
    return hooks.iff(false,
      [hookFcnSync]
    )
      .else([
        hookFcnSync,
        hookFcnSync,
        hookFcnSync
      ])(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('services iff - runs iff(true, iff(true, ...)', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  it('using iff(true, iff(true, hookFcnSync))', () => {
    return hooks.iff(true,
      hookFcnAsync,
      hooks.iff(true, hookFcnSync),
      hookCb
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('using iff(true, iff(true, hookFcnAsync))', () => {
    return hooks.iff(true,
      hookFcnSync,
      hooks.iff(true, hookFcnAsync),
      hookCb
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('runs iff(true, iff(true, hookFcnCb))', () => {
    return hooks.iff(true,
      hookFcnSync,
      hooks.iff(true, hookCb),
      hookFcnAsync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('runs iff(true, iff(true, hookFcnCb)) with the array syntax', () => {
    return hooks.iff(true, [
      hookFcnSync,
      hooks.iff(true, [hookCb]),
      hookFcnAsync
    ])(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('services iff - runs iff(true, iff(false).else(...)', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  it('using iff(true, iff(false).else(hookFcnSync))', () => {
    return hooks.iff(true,
      hookFcnAsync,
      hooks.iff(false, hookCb).else(hookFcnSync),
      hookFcnAsync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 2);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('using iff(true, iff(false).else(hookFcnAsync))', () => {
    return hooks.iff(true,
      hookFcnSync,
      hooks.iff(false, hookFcnSync).else(hookFcnAsync),
      hookFcnSync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('services iff - runs iff(false).else(iff(...).else(...))', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  it('using iff(false).else(iff(true, ...))', () => {
    return hooks.iff(false,
      hookCb
    )
      .else(
        hookFcnSync,
        hooks.iff(true, hookFcnAsync),
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('runs iff(false).else(iff(false).else(...))', () => {
    return hooks.iff(false,
      hookCb
    )
      .else(
        hookFcnSync,
        hooks.iff(false, hookFcnSync).else(hookFcnAsync),
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('runs iff(false).else(iff(false).else(...)) with the array syntax', () => {
    return hooks.iff(false,
      [hookCb]
    )
      .else([
        hookFcnSync,
        hooks.iff(false, [hookFcnSync]).else([hookFcnAsync]),
        hookFcnSync
      ])(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('services iff - multiple iff() sequentially', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  it('runs in iff(true, ...)', () => {
    return hooks.iff(true,
      hookCb,
      hooks.iff(true, hookFcnSync, hookFcnSync, hookFcnSync),
      hookCb,
      hooks.iff(true, hookFcnAsync, hookFcnAsync, hookFcnAsync, hookFcnAsync),
      hookCb
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 4);
        assert.equal(hookFcnCalls, 3);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('runs in iff(false).else(...)', () => {
    return hooks.iff(false,
      hookCb
    )
      .else(
        hookFcnSync,
        hooks.iff(true, hookFcnAsync),
        hooks.iff(false, hookFcnSync).else(hookCb),
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  it('runs in iff(false).else(...) with the array syntax', () => {
    return hooks.iff(false,
      [hookCb]
    )
      .else([
        hookFcnSync,
        hooks.iff(true, [hookFcnAsync]),
        hooks.iff(false, [hookFcnSync]).else([hookCb]),
        hookFcnSync
      ])(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
