
/* eslint no-param-reassign: 0, no-shadow: 0, no-unused-vars: 0, no-var: 0 */

const assert = require('chai').assert;
const fs = require('fs');

const promisifyHook = require('../lib/promisify').promisifyHook;

const isPromise = obj => (
  obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
);

const funcSyncCbHook = (a, b) => (hook, next) => {
  next(!hook || hook.data.a === 'a' ? null : 'bad', hook);
};

const funcAsyncCbHook = (a, b) => (hook, next) => {
  fs.stat('./feathers-hooks-common-gfgfgfgfgfgf', () => {
    next(!hook || hook.data.a === 'a' ? null : 'bad', hook);
  });
};

const funcSyncHook = (a, b) => (hook) => {
  if (hook && hook.data.a !== 'a') {
    throw new Error('bad');
  }

  return hook;
};

const funcPromiseHook = (a, b) => (hook) => {
  if (hook.data.a === 'a') {
    return Promise.resolve(hook);
  }

  return Promise.reject('bad'); // eslint-disable-line prefer-rest-params
};

describe('promisifyHook', () => {
  describe('callback hook sync', () => {
    it('resolves - hook provided', (done) => {
      promisifyHook(funcSyncCbHook(1, 2))({ data: { a: 'a' } })
        .then(data => {
          assert.deepEqual(data, { data: { a: 'a' } });
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('resolves - forces alignment of cb', (done) => {
      promisifyHook(funcSyncCbHook(1, 2))()
        .then(data => {
          assert.equal(data, undefined);
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('rejects', (done) => {
      promisifyHook(funcSyncCbHook(1, 2))({ data: { a: 'bad' } })
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err, 'bad');
          done();
        });
    });
  });

  describe('callback hook async', () => {
    it('resolves', (done) => {
      const hookFcn = promisifyHook(funcAsyncCbHook());

      // What Feathers does
      const returnedToFeathers = hookFcn( // how Feathersjs would call the hook func
        { data: { a: 'a' } },
        () => {
          assert(false, 'hook callback unexpectedly called.');
          done();
        }
      );

      if (!isPromise(returnedToFeathers)) {
        assert(false, 'promise was not returned');
        done();
      }

      returnedToFeathers
        .then(data => {
          assert.deepEqual(data, { data: { a: 'a' } });
          done();
        })
        .catch(err => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('rejects', (done) => {
      const hookFcn = promisifyHook(funcAsyncCbHook());

      // What Feathers does
      const returnedToFeathers = hookFcn( // how Feathersjs would call the hook func
        { data: { a: 'b' } },
        () => {
          assert(false, 'hook callback unexpectedly called.');
          done();
        }
      );

      if (!isPromise(returnedToFeathers)) {
        assert(false, 'promise was not returned');
        done();
      }

      returnedToFeathers
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err, 'bad');
          done();
        });
    });
  });

  describe('sync hook', () => {
    it('resolves - hook provided', (done) => {
      promisifyHook(funcSyncHook(1, 2))({ data: { a: 'a' } })
        .then(data => {
          assert.deepEqual(data, { data: { a: 'a' } });
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('resolves - forces alignment of cb', (done) => {
      promisifyHook(funcSyncHook(1, 2))()
        .then(data => {
          assert.equal(data, undefined);
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('rejects', (done) => {
      promisifyHook(funcSyncHook(1, 2))({ data: { a: 'bad' } })
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err.message, 'bad');
          done();
        });
    });
  });

  describe('promise hook', () => {
    it('resolves', (done) => {
      const hookFcn = promisifyHook(funcPromiseHook());

      // What Feathers does
      const returnedToFeathers = hookFcn( // how Feathersjs would call the hook func
        { data: { a: 'a' } },
        () => {
          assert(false, 'hook callback unexpectedly called.');
          done();
        }
      );

      if (!isPromise(returnedToFeathers)) {
        assert(false, 'promise was not returned');
        done();
      }

      returnedToFeathers
        .then(data => {
          assert.deepEqual(data, { data: { a: 'a' } });
          done();
        })
        .catch(err => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('rejects', (done) => {
      const hookFcn = promisifyHook(funcPromiseHook());

      // What Feathers does
      const returnedToFeathers = hookFcn( // how Feathersjs would call the hook func
        { data: { a: 'b' } },
        () => {
          assert(false, 'hook callback unexpectedly called.');
          done();
        }
      );

      if (!isPromise(returnedToFeathers)) {
        assert(false, 'promise was not returned');
        done();
      }

      returnedToFeathers
        .then(data => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err, 'bad');
          done();
        });
    });
  });
});
