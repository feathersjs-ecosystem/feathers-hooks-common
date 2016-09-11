
/* eslint no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
const hooks = require('../lib/index');

var hook;
var hookBefore;
var hookAfter;
var hookFcnSyncCalls;
var hookFcnAsyncCalls;

const hookFcnSync = (hook) => {
  hookFcnSyncCalls = + 1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook) => new Promise(resolve => {
  hookFcnAsyncCalls = + 1;
  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

describe('iff - sync predicate, sync hook', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('calls sync hook function if truthy non-function', () => {
    const result = hooks.iff('a', hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.deepEqual(hook, hookAfter);
    }
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
    const result = hooks.iff(() => 'a', hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      assert.fail(true, false, 'promise unexpectedly returned');
    } else {
      assert.deepEqual(result, hookAfter);
      assert.equal(hookFcnSyncCalls, 1);
      assert.deepEqual(hook, hookAfter);
    }
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

// Helpers

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
