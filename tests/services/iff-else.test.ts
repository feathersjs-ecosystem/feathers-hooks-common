
// @ts-expect-error ts-migrate(6200) FIXME: Definitions of the following identifiers conflict ... Remove this comment to see the full error message
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookBefore... Remove this comment to see the full error message
let hookBefore;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookAfter'... Remove this comment to see the full error message
let hookAfter;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
let hookFcnSyncCalls: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnAsy... Remove this comment to see the full error message
let hookFcnAsyncCalls: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnCal... Remove this comment to see the full error message
let hookFcnCalls: any;
let predicateHook: any;
let predicateOptions: any;
let predicateValue: any;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'predicateS... Remove this comment to see the full error message
const predicateSync = (hook: any) => {
  predicateHook = clone(hook);
  return true;
};

const predicateSync2 = (options: any) => (hook: any) => {
  predicateOptions = clone(options);
  predicateHook = clone(hook);
  return true;
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'predicateA... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnSyn... Remove this comment to see the full error message
const hookFcnSync = (hook: any) => {
  hookFcnSyncCalls += 1;

  hook.data.first = hook.data.first.toLowerCase();

  return hook;
};

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hookFcnAsy... Remove this comment to see the full error message
const hookFcnAsync = (hook: any) => new Promise(resolve => {
  hookFcnAsyncCalls += 1;

  hook.data.first = hook.data.first.toLowerCase();

  resolve(hook);
});

const hookCb = (hook: any) => {
  hookFcnCalls += 1;

  return hook;
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - sync predicate, sync hook', () => {
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
    return hooks.iff('a', hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls sync hook function if sync predicate truthy', () => {
    return hooks.iff(() => 'a', hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - sync predicate, async hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls async hook function if sync predicate truthy', () => {
    return hooks.iff(true, hookFcnAsync)(hook)
      .then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls async hook function if sync predicate returns truthy', () => {
    return hooks.iff(() => true, hookFcnAsync)(hook)
      .then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - async predicate, sync hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls sync hook function if aync predicate truthy', () => {
    return hooks.iff(() => new Promise(resolve => resolve(true)), hookFcnSync)(hook)
      .then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not call sync hook function if async predicate falsey', () => {
    return hooks.iff(() => new Promise(resolve => resolve(false)), hookFcnSync)(hook)
      .then((result1: any) => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnSyncCalls, 0);
        assert.deepEqual(hook, hookBefore);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - async predicate, async hook', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('calls async hook function if aync predicate truthy', () => {
    return hooks.iff(() => new Promise(resolve => resolve(true)), hookFcnAsync)(hook)
      .then((result1: any) => {
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('does not call async hook function if async predicate falsey', () => {
    return hooks.iff(() => new Promise(resolve => resolve(false)), hookFcnAsync)(hook)
      .then((result1: any) => {
        assert.deepEqual(result1, hookBefore);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.deepEqual(hook, hookBefore);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - sync predicate', () => {
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
    return hooks.iff(() => 'a', hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is passed hook as param', () => {
    return hooks.iff(predicateSync, hookFcnSync)(hook)
      .then((hook: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('a higher order predicate can pass more options', () => {
    return hooks.iff(predicateSync2({ z: 'z' }), hookFcnSync)(hook)
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
describe('services iff - async predicate', () => {
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
  it('is passed hook as param', () => {
    return hooks.iff(predicateAsync, hookFcnSync)(hook)
      .then((result1: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('is resolved', () => {
    return hooks.iff(predicateAsyncFunny, hookFcnSync)(hook)
      .then((result1: any) => {
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);

        assert.equal(predicateValue, 'abc');
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('a higher order predicate can pass more options', () => {
    return hooks.iff(predicateAsync2({ y: 'y' }), hookFcnSync)(hook)
      .then((result1: any) => {
        assert.deepEqual(predicateOptions, { y: 'y' });
        assert.deepEqual(predicateHook, hookBefore);
        assert.deepEqual(result1, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.deepEqual(result1, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - runs .else()', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using iff(true, ...)', () => {
    return hooks.iff(true,
      hookFcnSync,
      hookFcnSync,
      hookFcnSync
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using if(false).else(...)', () => {
    return hooks.iff(false,
      hookFcnSync
    )
      .else(
        hookFcnSync,
        hookFcnSync,
        hookFcnSync
      )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using if(false).else(...) with the array syntax', () => {
    return hooks.iff(false,
      [hookFcnSync]
    )
      .else([
        hookFcnSync,
        hookFcnSync,
        hookFcnSync
      ])(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 0);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - runs iff(true, iff(true, ...)', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using iff(true, iff(true, hookFcnSync))', () => {
    return hooks.iff(true,
      hookFcnAsync,
      hooks.iff(true, hookFcnSync),
      hookCb
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using iff(true, iff(true, hookFcnAsync))', () => {
    return hooks.iff(true,
      hookFcnSync,
      hooks.iff(true, hookFcnAsync),
      hookCb
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs iff(true, iff(true, hookFcnCb))', () => {
    return hooks.iff(true,
      hookFcnSync,
      hooks.iff(true, hookCb),
      hookFcnAsync
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs iff(true, iff(true, hookFcnCb)) with the array syntax', () => {
    return hooks.iff(true, [
      hookFcnSync,
      hooks.iff(true, [hookCb]),
      hookFcnAsync
    ])(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - runs iff(true, iff(false).else(...)', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using iff(true, iff(false).else(hookFcnSync))', () => {
    return hooks.iff(true,
      hookFcnAsync,
      hooks.iff(false, hookCb).else(hookFcnSync),
      hookFcnAsync
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 2);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using iff(true, iff(false).else(hookFcnAsync))', () => {
    return hooks.iff(true,
      hookFcnSync,
      hooks.iff(false, hookFcnSync).else(hookFcnAsync),
      hookFcnSync
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - runs iff(false).else(iff(...).else(...))', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('using iff(false).else(iff(true, ...))', () => {
    return hooks.iff(false,
      hookCb
    )
      .else(
        hookFcnSync,
        hooks.iff(true, hookFcnAsync),
        hookFcnSync
      )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs iff(false).else(iff(false).else(...))', () => {
    return hooks.iff(false,
      hookCb
    )
      .else(
        hookFcnSync,
        hooks.iff(false, hookFcnSync).else(hookFcnAsync),
        hookFcnSync
      )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs iff(false).else(iff(false).else(...)) with the array syntax', () => {
    return hooks.iff(false,
      [hookCb]
    )
      .else([
        hookFcnSync,
        hooks.iff(false, [hookFcnSync]).else([hookFcnAsync]),
        hookFcnSync
      ])(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 0);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services iff - multiple iff() sequentially', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
    hookFcnCalls = 0;
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('runs in iff(true, ...)', () => {
    return hooks.iff(true,
      hookCb,
      hooks.iff(true, hookFcnSync, hookFcnSync, hookFcnSync),
      hookCb,
      hooks.iff(true, hookFcnAsync, hookFcnAsync, hookFcnAsync, hookFcnAsync),
      hookCb
    )(hook)
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 3);
        assert.equal(hookFcnAsyncCalls, 4);
        assert.equal(hookFcnCalls, 3);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
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
      .then((hook: any) => {
        assert.equal(hookFcnSyncCalls, 2);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCalls, 1);

        assert.deepEqual(hook, hookAfter);
      });
  });
});

// Helpers

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
