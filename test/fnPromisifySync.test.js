
/* eslint no-param-reassign: 0, no-shadow: 0, no-unused-vars: 0, no-var: 0 */

const assert = require('chai').assert;
const fs = require('fs');

const fnPromisifySync = require('../lib/promisify').fnPromisifySync;

const isPromise = obj => (
  obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
);

function funcSync3(data, a, b) {
  if (data === 3) {
    throw new Error('throwing');
  }

  return data === 1 ? data : 'bad';
}

function funcSync3a(...rest) {
  return rest.length;
}

const funcSyncHook = (a, b) => (hook) => {
  if (hook && hook.data.a !== 'a') {
    throw new Error('bad');
  }

  return hook;
};

function funcPromise3(data, a, b) {
  if (data === 1) {
    return Promise.resolve(data);
  }

  return Promise.reject(arguments.length); // eslint-disable-line prefer-rest-params
}

const funcPromiseHook = (a, b) => (hook) => {
  if (hook.data.a === 'a') {
    return Promise.resolve(hook);
  }

  return Promise.reject('bad'); // eslint-disable-line prefer-rest-params
};

describe('fnPromisifySync - sync function', () => {
  describe('passes all args', () => {
    it('resolves', (done) => {
      fnPromisifySync(funcSync3)(1, 0, 0)
        .then(data => {
          assert.equal(data, 1);
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('rejects when throws', (done) => {
      fnPromisifySync(funcSync3)(3, 0, 0)
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err.message, 'throwing');
          done();
        });
    });

    it('passes all params 1', (done) => {
      fnPromisifySync(funcSync3a)(1, 0)
        .then(data => {
          assert.equal(data, 2);
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });

    it('passes all params 2', (done) => {
      fnPromisifySync(funcSync3a)(1, 0, 0, 0, 0)
        .then(data => {
          assert.equal(data, 5);
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
          done();
        });
    });
  });

  describe('works with feathers hooks', () => {
    describe('sync hook', () => {
      it('convert hook to promise - no arg length', (done) => {
        fnPromisifySync(funcSyncHook(1, 2))({ data: { a: 'a' } })
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
        fnPromisifySync(funcSyncHook(1, 2))()
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
        fnPromisifySync(funcSyncHook(1, 2))({ data: { a: 'bad' } })
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
  });
});

describe('fnPromisifySync - function returning promise', () => {
  describe('passes all args', () => {
    it('resolves', (done) => {
      fnPromisifySync(funcPromise3, 'p')(1, 0, 0)
        .then(data => {
          assert.equal(data, 1);
          done();
        })
        .catch(() => {
          assert(false, 'unexpected catch');
        });
    });

    it('rejects', (done) => {
      fnPromisifySync(funcPromise3, 'p')(2, 0, 0)
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err, 3);
          done();
        });
    });

    it('does not control their args len - too few', (done) => {
      fnPromisifySync(funcPromise3, 'p')(2, 0)
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err, 2);
          done();
        });
    });

    it('does not control their args len - too many', (done) => {
      fnPromisifySync(funcPromise3, 'p')(2, 0, 0, 0, 0)
        .then(() => {
          assert(false, 'unexpected then');
          done();
        })
        .catch(err => {
          assert.equal(err, 5);
          done();
        });
    });
  });

  describe('works with Feather hooks', () => {
    it('resolves', (done) => {
      const hookFcn = fnPromisifySync(funcPromiseHook());

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
      const hookFcn = fnPromisifySync(funcPromiseHook());

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
