

/* eslint-env es6, node */
/* eslint  no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
var errors = require('feathers-errors');
const hooks = require('../lib/index');

var fcnSync;
var fcnPromise;
var fcnPromiseSanitize;
var origHookOk;
var origHookBad;
var hookOk;
var hookBad;

describe('validate DEPRECATED hooks', () => {
  describe('validateSync', () => {
    beforeEach(() => {
      fcnPromise = (values) => (values.email ? null : { email: 'Email is invalid' });
      hookOk = { type: 'before', method: 'create', data: { email: 'a@a.com' } };
      hookBad = { type: 'before', method: 'create', data: { email: '' } };
    });

    it('test passes', () => {
      const retHook = hooks.validateSync(fcnPromise)(hookOk);
      assert.deepEqual(retHook, hookOk);
    });

    it('test fails', () => {
      assert.throws(() => { hooks.validateSync(fcnPromise)(hookBad); });
    });
  });

  describe('validateUsingCallback', () => {
    origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
    origHookBad = { type: 'before', method: 'create', data: { email: '' } };

    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);

      fcnPromise = (values, param2, cb) => {
        setTimeout(() => {
          values.email.trim() // eslint-disable-line no-unused-expressions
            ? cb(null)
            : cb({ email: 'Email is invalid' });
        }, 100);
      };

      fcnPromiseSanitize = (values, param2, cb) => {
        setTimeout(() => {
          values.email.trim() // eslint-disable-line no-unused-expressions
            ? cb(null, Object.assign(values, { email: values.email.trim() }))
            : cb({ email: 'Email is invalid' });
        }, 100);
      };
    });

    it('test passes on correct data', (next) => {
      hooks.validateUsingCallback(fcnPromise, 'value4param2')(hookOk, (err, hook) => {
        assert.equal(err, null);
        assert.deepEqual(hook, origHookOk);
        next();
      });
    });

    it('test can sanitize correct data', (next) => {
      hooks.validateUsingCallback(fcnPromiseSanitize, 'value4param2')(hookOk, (err, hook) => {
        assert.equal(err, null);
        assert.deepEqual(hook.data.email, 'a@a.com');
        next();
      });
    });

    it('test fails on errors', (next) => {
      hooks.validateUsingCallback(fcnPromise, 'val4param2')(hookBad, (err) => {
        assert.deepEqual(err.errors, { email: 'Email is invalid' });
        next();
      });
    });
  });

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
});

// Helpers

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
