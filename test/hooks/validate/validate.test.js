
import { assert } from 'chai';
import hooks from '../../../src/hooks';
import errors from 'feathers-errors';

var fcnSync;
var fcnPromise;
var fcnPromiseSanitize;
var origHookOk;
var origHookBad;
var hookOk;
var hookBad;

describe('validate', () => {
  origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
  origHookBad = { type: 'before', method: 'create', data: { email: '' } };

  describe('Sync function', () => {
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);

      fcnSync = (values) => (values.email.trim() // eslint-disable-line no-unused-expressions
          ? null
          : { email: 'Email is invalid' }
      );
    });

    it('test passes on correct data', () => {
      const hook = hooks.validate(fcnSync)(hookOk);
      assert.deepEqual(hook, origHookOk);
    });

    it('test fails on errors', () => {
      assert.throws(() => hooks.validate(fcnSync)(hookBad));
    });
  });

  describe('Promise function', () => {
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);

      fcnPromise = (values) => (
        new Promise((resolve, reject) => {
          setTimeout(() => {
            values.email.trim() // eslint-disable-line no-unused-expressions
              ? resolve()
              : reject(new errors.BadRequest({ email: 'Email is invalid' }));
          }, 100);
        })
      );

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
