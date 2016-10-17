
/* eslint no-param-reassign: 0, no-shadow: 0, no-unused-vars: 0, no-var: 0 */

const assert = require('chai').assert;
const fs = require('fs');

const fnPromisifyCallback = require('../lib/promisify').fnPromisifyCallback;

const isPromise = obj => (
  obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
);

function cb(err, data) {}

function funcCb3(data, a, b, cb) {
  if (data === 1) {
    cb(null, data);
  } else {
    cb('bad', data);
  }
}

function funcCb3Throw(data, a, b, cb) {
  throw new Error('bad');
}

function funcCb0Resolve(cb) {
  cb(null, 1);
}

function funcCb0Reject(cb) {
  cb('bad');
}

const funcSyncCbHook = (a, b) => (hook, next) => {
  next(!hook || hook.data.a === 'a' ? null : 'bad', hook);
};

const funcAsyncCbHook = (a, b) => (hook, next) => {
  fs.stat('./feathers-hooks-common-gfgfgfgfgfgf', () => {
    next(!hook || hook.data.a === 'a' ? null : 'bad', hook);
  });
};

describe('fnPromisifyCallback', () => {
  describe('paramsCountBeforeCb provided', () => {
    describe('correct number of params', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb3, 3)(1, 0, 0)
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
        fnPromisifyCallback(funcCb3, 3)(2, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });

      it('resolves with no args', (done) => {
        fnPromisifyCallback(funcCb0Resolve, 0)()
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
        fnPromisifyCallback(funcCb0Reject, 0)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });

      it('rejects if throws', (done) => {
        fnPromisifyCallback(funcCb3Throw, 3)(2, 0, 0)
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
        fnPromisifyCallback(funcCb3, 3)(1)
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
        fnPromisifyCallback(funcCb3, 3)(2)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });

    describe('too many params', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb3, 3)(1, 0, 0, 0, 0)
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
        fnPromisifyCallback(funcCb3, 3)(2, 0, 0, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });

    describe('only param is cb', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb0Resolve, 0)()
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
        fnPromisifyCallback(funcCb0Reject, 0)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });
  });

  describe('paramsCountBeforeCb = Infinity', () => {
    describe('correct number of params', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb3, Infinity)(1, 0, 0)
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
        fnPromisifyCallback(funcCb3, Infinity)(2, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });

    describe('only param is cb', () => {
      it('resolves with no args', (done) => {
        fnPromisifyCallback(funcCb0Resolve, Infinity)()
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
        fnPromisifyCallback(funcCb0Reject, Infinity)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });
  });

  describe('paramsCountBeforeCb calculated', () => {
    describe('correct number of params', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb3)(1, 0, 0)
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
        fnPromisifyCallback(funcCb3)(2, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });

      it('resolves with no args', (done) => {
        fnPromisifyCallback(funcCb0Resolve)()
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
        fnPromisifyCallback(funcCb0Reject)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });

    describe('too few params', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb3)(1)
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
        fnPromisifyCallback(funcCb3)(2)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });

    describe('too many params', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb3)(1, 0, 0, 0, 0)
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
        fnPromisifyCallback(funcCb3)(2, 0, 0, 0, 0)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });

      it('resolves with no args', (done) => {
        fnPromisifyCallback(funcCb0Resolve)(1, 2)
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
        fnPromisifyCallback(funcCb0Reject)(1, 2)
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });

    describe('only param is cb', () => {
      it('resolves', (done) => {
        fnPromisifyCallback(funcCb0Resolve)()
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
        fnPromisifyCallback(funcCb0Reject)()
          .then(() => {
            assert(false, 'unexpected catch');
            done();
          })
          .catch(err => {
            assert.equal(err, 'bad');
            done();
          });
      });
    });
  });

  describe('works with feathers hooks', () => {
    describe('sync hook', () => {
      it('convert hook to promise - no arg length', (done) => {
        fnPromisifyCallback(funcSyncCbHook(1, 2))({ data: { a: 'a' } })
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
        fnPromisifyCallback(funcSyncCbHook(1, 2))()
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
        fnPromisifyCallback(funcSyncCbHook(1, 2))({ data: { a: 'bad' } })
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
        const hookFcn = fnPromisifyCallback(funcAsyncCbHook());

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
        const hookFcn = fnPromisifyCallback(funcAsyncCbHook());

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
