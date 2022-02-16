
// @ts-expect-error ts-migrate(6200) FIXME: Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

let hook;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
let hookFcnSyncCalls;
let hookFcnAsyncCalls;
let hookFcnCalls;
let predicateHook;
let predicateOptions;
let predicateValue;

const predicateSync = (hook: any) => {
  predicateHook = clone(hook);
  return true;
};

const predicateSync2 = (options: any) => (hook: any) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return true;
};

const predicateAsync = (hook: any) => {
  predicateHook = clone(hook);
  return new Promise(resolve => resolve(true));
};

const predicateAsync2 = (options: any) => (hook: any) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return new Promise(resolve => resolve(true));
};

const predicateAsyncFunny = (hook: any) => {
  predicateHook = clone(hook);
  return new Promise(resolve => {
    predicateValue = 'abc';
    return resolve(predicateValue);
  });
};

const hookFcnSync = (hook: any) => {
  hookFcnSyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

const hookFcnAsync = (hook: any) => new Promise(resolve => {
  hookFcnAsyncCalls = +1;
  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcn'.
const hookFcn = (hook: any) => {
  hookFcnCalls = +1;

  return hook;
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - sync predicate, sync hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls sync hook function if truthy non-function', () => {
    hooks.when('a', hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls sync hook function if sync predicate truthy', () => {
    hooks.when(() => 'a', hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - sync predicate, async hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls async hook function if sync predicate truthy', (done: any) => {
    const result = hooks.when(true, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls async hook function if sync predicate returns truthy', (done: any) => {
    const result = hooks.when(() => true, hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - async predicate, sync hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls sync hook function if aync predicate truthy', (done: any) => {
    const result = hooks.when(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not call sync hook function if async predicate falsey', (done: any) => {
    const result = hooks.when(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - async predicate, async hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls async hook function if aync predicate truthy', (done: any) => {
    const result = hooks.when(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not call async hook function if async predicate falsey', (done: any) => {
    const result = hooks.when(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - sync predicate', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    predicateHook = null;
    predicateOptions = null;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not need to access hook', () => {
    hooks.when(() => 'a', hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is passed hook as param', () => {
    hooks.when(predicateSync, hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('a higher order predicate can pass more options', () => {
    hooks.when(predicateSync2({ z: 'z' }), hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(predicateOptions, { z: 'z' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - async predicate', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is passed hook as param', (done: any) => {
    const result = hooks.when(predicateAsync, hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
      result.then((result1: any) => {
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is resolved', (done: any) => {
    const result = hooks.when(predicateAsyncFunny, hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
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

      done();
    }
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('a higher order predicate can pass more options', (done: any) => {
    const result = hooks.when(predicateAsync2({ y: 'y' }), hookFcnSync)(hook);

    if (result && typeof result.then === 'function') {
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

      done();
    }
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services when - runs multiple hooks', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs successfully', (done: any) => {
    hooks.when(true, hookFcnSync, hookFcnAsync, hookFcn)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs successfully with the array syntax', (done: any) => {
    hooks.when(true, [hookFcnSync, hookFcnAsync, hookFcn])(hook)
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
