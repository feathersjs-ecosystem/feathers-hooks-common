

/* eslint-env es6, node */
/* eslint  no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const assert = require('chai').assert;
var errors = require('feathers-errors');
const hooks = require('../lib/index');

var fcn;
var fcnSanitize;
var origHookOk;
var origHookBad;
var hookOk;
var hookBad;

describe('validate', () => {
  describe('validateSync', () => {
    beforeEach(() => {
      fcn = (values) => (values.email ? null : { email: 'Email is invalid' });
      hookOk = { type: 'before', method: 'create', data: { email: 'a@a.com' } };
      hookBad = { type: 'before', method: 'create', data: { email: '' } };
    });

    it('test passes', () => {
      const retHook = hooks.validateSync(fcn)(hookOk);
      assert.deepEqual(retHook, hookOk);
    });

    it('test fails', () => {
      assert.throws(() => { hooks.validateSync(fcn)(hookBad); });
    });
  });

  describe('validateUsingCallback', () => {
    origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
    origHookBad = { type: 'before', method: 'create', data: { email: '' } };

    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);

      fcn = (values, param2, cb) => {
        setTimeout(() => {
          values.email.trim() // eslint-disable-line no-unused-expressions
            ? cb(null)
            : cb({ email: 'Email is invalid' });
        }, 100);
      };

      fcnSanitize = (values, param2, cb) => {
        setTimeout(() => {
          values.email.trim() // eslint-disable-line no-unused-expressions
            ? cb(null, Object.assign(values, { email: values.email.trim() }))
            : cb({ email: 'Email is invalid' });
        }, 100);
      };
    });

    it('test passes on correct data', (next) => {
      hooks.validateUsingCallback(fcn, 'value4param2')(hookOk, (err, hook) => {
        assert.equal(err, null);
        assert.deepEqual(hook, origHookOk);
        next();
      });
    });

    it('test can sanitize correct data', (next) => {
      hooks.validateUsingCallback(fcnSanitize, 'value4param2')(hookOk, (err, hook) => {
        assert.equal(err, null);
        assert.deepEqual(hook.data.email, 'a@a.com');
        next();
      });
    });

    it('test fails on errors', (next) => {
      hooks.validateUsingCallback(fcn, 'val4param2')(hookBad, (err) => {
        assert.deepEqual(err, { errors: { email: 'Email is invalid' } });
        next();
      });
    });
  });

  describe('validateUsingPromise', () => {
    origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
    origHookBad = { type: 'before', method: 'create', data: { email: '' } };

    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);

      fcn = (values) => (
        new Promise((resolve, reject) => {
          setTimeout(() => {
            values.email.trim() // eslint-disable-line no-unused-expressions
              ? resolve()
              : reject(new errors.BadRequest({ email: 'Email is invalid' }));
          }, 100);
        })
      );

      fcnSanitize = (values) => (
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
      hooks.validateUsingPromise(fcn)(hookOk)
        .then(hook => {
          assert.deepEqual(hook, origHookOk);
          next();
        })
        .catch(err => next(err));
    });

    it('test can sanitize correct data', (next) => {
      hooks.validateUsingPromise(fcnSanitize)(hookOk)
        .then(hook => {
          assert.equal(hook.data.email, 'a@a.com');
          next();
        })
        .catch(err => next(err));
    });

    it('test fails on errors', (next) => {
      hooks.validateUsingPromise(fcnSanitize)(hookBad)
        .then(() => {
          assert.fail(true, false, 'test should not have completed successfully');
        })
        .catch(() => next());
    });
  });
});

// Helpers

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
