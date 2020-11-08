
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
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook) => new Promise(resolve => {
  hookFcnAsyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

const hookFcn = (hook) => {
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
    hooks.when('a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if falsey non-function', () => {
    const result = hooks.when('', hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnSyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls sync hook function if sync predicate truthy', () => {
    hooks.when(() => 'a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('does not call sync hook function if sync predicate falsey', () => {
    const result = hooks.when(() => '', hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
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

  it('calls async hook function if sync predicate truthy', (done) => {
    const result = hooks.when(true, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
    }
  });

  it('does not call async hook function if sync predicate falsey', () => {
    const result = hooks.when(false, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnAsyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls async hook function if sync predicate returns truthy', (done) => {
    const result = hooks.when(() => true, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
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

  it('calls sync hook function if aync predicate truthy', (done) => {
    const result = hooks.when(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
    }
  });

  it('does not call sync hook function if async predicate falsey', (done) => {
    const result = hooks.when(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnSyncCalls, 0);
        assert.deepEqual(hook, hookBefore);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
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

  it('calls async hook function if aync predicate truthy', (done) => {
    const result = hooks.when(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');
      done();
    }
  });

  it('does not call async hook function if async predicate falsey', (done) => {
    const result = hooks.when(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.deepEqual(hook, hookBefore);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');
      done();
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
    hooks.when(() => 'a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('is passed hook as param', () => {
    hooks.when(predicateSync, hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('a higher order predicate can pass more options', () => {
    hooks.when(predicateSync2({ z: 'z' }), hookFcnSync)(hook)
      .then(hook => {
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

  it('is passed hook as param', (done) => {
    const result = hooks.when(predicateAsync, hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
    }
  });

  it('is resolved', (done) => {
    const result = hooks.when(predicateAsyncFunny, hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        assert.equal(predicateValue, 'abc');

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
    }
  });

  it('a higher order predicate can pass more options', (done) => {
    const result = hooks.when(predicateAsync2({ y: 'y' }), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then(result1 => {
        assert.deepEqual(predicateOptions, { y: 'y' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        done();
      });
    } else {
      assert.fail(true, false, 'promise unexpectedly not returned');

      done();
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

  it('runs successfully', (done) => {
    hooks.when(true, hookFcnSync, hookFcnAsync, hookFcn)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('runs successfully with the array syntax', (done) => {
    hooks.when(true, [hookFcnSync, hookFcnAsync, hookFcn])(hook)
      .then(hook => {
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

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
