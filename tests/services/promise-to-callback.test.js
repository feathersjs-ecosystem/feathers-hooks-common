
const {
  assert
} = require('chai');

const {
  promiseToCallback
} = require('../../lib/services');

const promise1 = (ifResolve) => new Promise((resolve, reject) => {
  return ifResolve ? resolve('ok') : reject(new Error('bad'));
});

describe('services promiseToCallback', () => {
  it('calls callback on resolve', (done) => {
    promiseToCallback(promise1(true))((err, data) => {
      assert.strictEqual(err, null, 'err code set');
      assert.strictEqual(data, 'ok');

      done();
    });
  });

  it('calls callback on reject', (done) => {
    promiseToCallback(promise1(false))((err) => {
      assert.strictEqual(err.message, 'bad', 'err code set');

      done();
    });
  });

  it('promise is still then\'able', (done) => {
    const promise = promise1(true);
    promiseToCallback(promise)(() => {});

    promise.then(() => {
      done();
    });
  });

  /* No idea how to test this.
     The throw from another scope gets caught by Mocha. try..catcj don't prevent it.
  it('promise\'s catch chain not invoked if callback throws', (done) => {
    var callbackThrows = false;
    var catchCalled = false;

    assert.doesNotThrow(() => {
      new Promise((resolve, reject) => {
        const promise = promise1(true);

        promiseToCallback(promise)(() => {
          callbackThrows = true;
          throw new Error('callback throws');
        });

        resolve();
      })
        .catch(err => {
          catchCalled = true;
          throw new Error('catch throws');
        });
    }, 'callback throws');

    setTimeout(() => {
      assert.equal(callbackThrows, true, 'callback did not throw');
      assert.equal(catchCalled, false, 'catch was called');

      done();
    }, 500);
  });
  */
});
