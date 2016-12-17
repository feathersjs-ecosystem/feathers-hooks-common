if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import hooks from '../../src/hooks';

var hook;
var hookBefore;
var hookAfter;
var hookFcnSyncCalls;
var hookFcnAsyncCalls;
var hookFcnCbCalls;

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

const hookFcnCb = (hook, cb) => {
  hookFcnCbCalls = +1;

  cb(null, hook);
};

describe('hooks iffElse - runs multiple hooks', () => {
  beforeEach(() => {
    hookBefore = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    hookAfter = { type: 'before', method: 'create', data: { first: 'john', last: 'Doe' } };
    hook = clone(hookBefore);
    hookFcnSyncCalls = 0;
    hookFcnAsyncCalls = 0;
  });

  it('when true', (done) => {
    hooks.iffElse(true, [hookFcnSync, hookFcnAsync, hookFcnCb], null)(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
        assert.equal(hookFcnAsyncCalls, 1);
        assert.equal(hookFcnCbCalls, 1);
        assert.deepEqual(hook, hookAfter);

        done();
      });
  });

  it('when false', (done) => {
    hooks.iffElse(false, null, [hookFcnSync, hookFcnAsync, hookFcnCb])(hook)
      .then(hook => {
        assert.deepEqual(hook, hookAfter);
        assert.equal(hookFcnSyncCalls, 1);
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
