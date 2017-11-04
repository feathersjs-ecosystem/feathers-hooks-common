
const {
  assert
} = require('chai');

const hooks = require('../../lib/services');
const errors = require('@feathersjs/errors');

let fcnSync;
let fcnPromise;
let fcnPromiseSanitize;
let origHookOk;
let origHookBad;
let hookOk;
let hookBad;
let fcnHook;

describe('services validate', () => {
  origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
  origHookBad = { type: 'before', method: 'create', data: { email: '' } };

  describe('Sync function', () => {
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);
      fcnHook = {};

      fcnSync = (values, hook) => {
        fcnHook = hook;

        return values.email.trim() ? null : { email: 'Email is invalid' };
      };
    });

    it('test passes on correct data', () => {
      const hook = hooks.validate(fcnSync)(hookOk);
      assert.deepEqual(hook, origHookOk);
      assert.deepEqual(fcnHook, origHookOk);
    });

    it('test fails on errors', () => {
      assert.throws(() => hooks.validate(fcnSync)(hookBad));
    });
  });

  describe('Promise function', () => {
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);
      fcnHook = {};

      fcnPromise = (values, hook) => {
        fcnHook = hook;

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            values.email.trim() // eslint-disable-line no-unused-expressions
              ? resolve()
              : reject(new errors.BadRequest({ email: 'Email is invalid' }));
          }, 100);
        });
      };

      fcnPromiseSanitize = (values) => (
        new Promise((resolve, reject) => {
          setTimeout(() => {
            values.email.trim() // eslint-disable-line no-unused-expressions
              ? resolve(Object.assign(values, { email: values.email.trim() }))
              : reject(new errors.BadRequest({ email: 'Email is invalid' }));
          }, 100);
        })
      );
    });

    it('test passes on correct data', (next) => {
      hooks.validate(fcnPromise)(hookOk)
        .then(hook => {
          assert.deepEqual(hook, origHookOk);
          assert.deepEqual(fcnHook, origHookOk);
          next();
        })
        .catch(err => next(err));
    });

    it('test can sanitize correct data', (next) => {
      hooks.validate(fcnPromiseSanitize)(hookOk)
        .then(hook => {
          assert.equal(hook.data.email, 'a@a.com');
          next();
        })
        .catch(err => next(err));
    });

    it('test fails on errors', (next) => {
      hooks.validate(fcnPromiseSanitize)(hookBad)
        .then(() => {
          assert.fail(true, false, 'test should not have completed successfully');
        })
        .catch(() => next());
    });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
