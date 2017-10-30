
const {
  assert
} = require('chai');

const fs = require('fs');

const {
  callbackToPromise
} = require('../../lib/services');

const isPromise = obj => (
  obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
);

function funcCb3 (data, a, b, cb) {
  if (data === 1) {
    cb(null, data);
  } else {
    cb(new Error('bad'), data);
  }
}

function funcCb3Throw () {
  throw new Error('bad');
}

function funcCb0Resolve (cb) {
  cb(null, 1);
}

function funcCb0Reject (cb) {
  cb(new Error('bad'));
}

const funcSyncCbHook = () => (hook, next) => {
  next(!hook || hook.data.a === 'a' ? null : 'bad', hook);
};

const funcAsyncCbHook = () => (hook, next) => {
  fs.stat('./feathers-hooks-common-gfgfgfgfgfgf', () => {
    next(!hook || hook.data.a === 'a' ? null : 'bad', hook);
  });
};

describe('services callbackToPromise', () => {
  describe('paramsCountBeforeCb provided', () => {
    describe('correct number of params', () => {
      it('resolves', (done) => {
        callbackToPromise(funcCb3, 3)(1, 0, 0)
          .then(data => {
            assert.equal(data, 1);
            done();
          })
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('rejects', (done) => {
        callbackToPromise(funcCb3, 3)(2, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err.message, 'bad');
            done();
          });
      });

      it('resolves with no args', (done) => {
        callbackToPromise(funcCb0Resolve, 0)()
          .then(data => {
            assert.equal(data, 1);
            done();
          })
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('rejects with no args', (done) => {
        callbackToPromise(funcCb0Reject, 0)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err.message, 'bad');
            done();
          });
      });

      it('rejects if throws', (done) => {
        callbackToPromise(funcCb3Throw, 3)(2, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err.message, 'bad');
            done();
          });
      });
    });

    describe('too few params', () => {
      it('resolves', (done) => {
        callbackToPromise(funcCb3, 3)(1)
          .then(data => {
            assert.equal(data, 1);
            done();
          })
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('rejects', (done) => {
        callbackToPromise(funcCb3, 3)(2)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err.message, 'bad');
            done();
          });
      });
    });

    describe('too many params', () => {
      it('resolves', (done) => {
        callbackToPromise(funcCb3, 3)(1, 0, 0, 0, 0)
          .then(data => {
            assert.equal(data, 1);
            done();
          })
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('rejects', (done) => {
        callbackToPromise(funcCb3, 3)(2, 0, 0, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err.message, 'bad');
            done();
          });
      });
    });

    describe('only param is cb', () => {
      it('resolves', (done) => {
        callbackToPromise(funcCb0Resolve, 0)()
          .then(data => {
            assert.equal(data, 1);
            done();
          })
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('rejects', (done) => {
        callbackToPromise(funcCb0Reject, 0)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err.message, 'bad');
            done();
          });
      });
    });
  });

  describe('works with feathers hooks', () => {
    describe('sync hook', () => {
      it('convert hook to promise - no arg length', (done) => {
        callbackToPromise(funcSyncCbHook(1, 2), 1)({ data: { a: 'a' } })
          .then(data => {
            assert.deepEqual(data, { data: { a: 'a' } });
            done();
          })
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('convert hook to promise - arg length', (done) => {
        callbackToPromise(funcSyncCbHook(1, 2), 1)()
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
        callbackToPromise(funcSyncCbHook(1, 2), 1)({ data: { a: 'bad' } })
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

    describe('async hook', () => {
      it('resolves', (done) => {
        const hookFcn = callbackToPromise(funcAsyncCbHook(), 1);

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
          .catch(() => {
            assert(false, 'unexpected catch');
            done();
          });
      });

      it('rejects', (done) => {
        const hookFcn = callbackToPromise(funcAsyncCbHook(), 1);

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
  });
});
