if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import hooks from '../src';

var hook;
var hookBefore;
var hookAfter;
var hookFcnSyncCalls;
var hookFcnAsyncCalls;
var hookFcnCbCalls;
var predicateHook;
var predicateOptions;
var predicateValue;

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
  console.log('hookFuncSync called', hookFcnSyncCalls);

  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook) => new Promise(resolve => {
  hookFcnAsyncCalls += 1;
  console.log('hookFuncAsync called', hookFcnAsyncCalls);

  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

const hookFcnCb = (hook, cb) => {
  hookFcnCbCalls += 1;
  console.log('hookFuncCb called', hookFcnCbCalls);

  cb(null, hook);
};

describe('iff - sync predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if truthy non-function', () => {
    hooks.iff('a', hookFcnSync)(hook)
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
    hooks.iff(() => 'a', hookFcnSync)(hook)
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

describe('iff - sync predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if sync predicate truthy', (done) => {
    const result = hooks.iff(true, hookFcnAsync)(hook);

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
    const result = hooks.iff(false, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookBefore);
      assert.equal(hookFcnAsyncCalls, 0);
      assert.deepEqual(hook, hookBefore);
    }
  });

  it('calls async hook function if sync predicate returns truthy', (done) => {
    const result = hooks.iff(() => true, hookFcnAsync)(hook);

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

describe('iff - async predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if aync predicate truthy', (done) => {
    const result = hooks.iff(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook);

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
    const result = hooks.iff(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook);

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

describe('iff - async predicate, async hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls async hook function if aync predicate truthy', (done) => {
    const result = hooks.iff(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook);

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
    const result = hooks.iff(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook);

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

describe('iff - sync predicate', () => {
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
    hooks.iff(() => 'a', hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('is passed hook as param', () => {
    hooks.iff(predicateSync, hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('a higher order predicate can pass more options', () => {
    hooks.iff(predicateSync2({ z: 'z' }), hookFcnSync)(hook)
      .then(hook => {
        assert.deepEqual(predicateOptions, { z: 'z' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });
});

describe('iff - async predicate', () => {
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
    const result = hooks.iff(predicateAsync, hookFcnSync)(hook);

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
    const result = hooks.iff(predicateAsyncFunny, hookFcnSync)(hook);

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
    const result = hooks.iff(predicateAsync2({ y: 'y' }), hookFcnSync)(hook);

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

describe('iff - runs .else()', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCbCalls = 0;
  });

  it('using iff(true, ...)', (done) => {
    hooks.iff(true,
      hookFcnSync,
      hookFcnSync,
      hookFcnSync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCbCalls, 0);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('using if(false).else(...)', (done) => {
    hooks.iff(false,
      hookFcnSync,
    )
      .else(
        hookFcnSync,
        hookFcnSync,
        hookFcnSync
      )(hook)
      .then(hook => {
        console.log('test then', hook, hookFcnSyncCalls);

        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCbCalls, 0);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });
});

describe('iff - runs iff(true, iff(true, ...)', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCbCalls = 0;
  });

  it('using iff(true, iff(true, hookFcnSync))', (done) => {
    hooks.iff(true,
      hookFcnAsync,
      hooks.iff(true, hookFcnSync),
      hookFcnCb
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 1);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('using iff(true, iff(true, hookFcnAsync))', (done) => {
    hooks.iff(true,
      hookFcnSync,
      hooks.iff(true, hookFcnAsync),
      hookFcnCb
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 1);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('runs iff(true, iff(true, hookFcnCb))', (done) => {
    hooks.iff(true,
      hookFcnSync,
      hooks.iff(true, hookFcnCb),
      hookFcnAsync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 1);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });
});

describe('iff - runs iff(true, iff(false).else(...)', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCbCalls = 0;
  });

  it('using iff(true, iff(false).else(hookFcnSync))', (done) => {
    hooks.iff(true,
      hookFcnAsync,
      hooks.iff(false, hookFcnCb).else(hookFcnSync),
      hookFcnAsync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 2);
        assert.equal(hookFcnCbCalls, 0);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('using iff(true, iff(false).else(hookFcnAsync))', (done) => {
    hooks.iff(true,
      hookFcnSync,
      hooks.iff(false, hookFcnSync).else(hookFcnAsync),
      hookFcnSync
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 0);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });
});

describe('iff - runs iff(false).else(iff(...).else(...))', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCbCalls = 0;
  });

  it('using iff(false).else(iff(true, ...))', (done) => {
    hooks.iff(false,
      hookFcnCb
    )
      .else(
        hookFcnSync,
        hooks.iff(true, hookFcnAsync),
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 0);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('runs iff(false).else(iff(false).else(...))', (done) => {
    console.log('test start hook.iff()');

    hooks.iff(false,
      hookFcnCb
    )
      .else(
        hookFcnSync,
        hooks.iff(false, hookFcnSync).else(hookFcnAsync),
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 0);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });
});

describe('iff - multiple iff() sequentially', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCbCalls = 0;
  });

  it('runs in iff(true, ...)', (done) => {
    hooks.iff(true,
      hookFcnCb,
      hooks.iff(true, hookFcnSync, hookFcnSync, hookFcnSync),
      hookFcnCb,
      hooks.iff(true, hookFcnAsync, hookFcnAsync, hookFcnAsync, hookFcnAsync),
      hookFcnCb
    )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 4);
        assert.equal(hookFcnCbCalls, 3);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('runs in iff(false).else(...)', (done) => {
    hooks.iff(false,
      hookFcnCb
    )
      .else(
        hookFcnSync,
        hooks.iff(true, hookFcnAsync),
        hooks.iff(false, hookFcnSync).else(hookFcnCb),
        hookFcnSync
      )(hook)
      .then(hook => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 1);

        assert.deepEqual(hook, hookAfter);

        done();
      });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
