
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

let fcnSync: any;
let fcnPromise: any;
let fcnPromiseSanitize: any;
let origHookOk: any;
let origHookBad: any;
let hookOk: any;
let hookBad: any;
let fcnHook: any;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services validate', () => {
  origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
  origHookBad = { type: 'before', method: 'create', data: { email: '' } };

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Sync function', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);
      fcnHook = {};

      fcnSync = (values: any, hook: any) => {
        fcnHook = hook;

        return values.email.trim() ? null : { email: 'Email is invalid' };
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('test passes on correct data', () => {
      const hook = hooks.validate(fcnSync)(hookOk);
      assert.deepEqual(hook, origHookOk);
      assert.deepEqual(fcnHook, origHookOk);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('test fails on errors', () => {
      assert.throws(() => hooks.validate(fcnSync)(hookBad));
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Promise function', () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);
      fcnHook = {};

      fcnPromise = (values: any, hook: any) => {
        fcnHook = hook;

        return new Promise((resolve, reject) => {
          setTimeout(() => {
            values.email.trim() // eslint-disable-line no-unused-expressions
              // @ts-expect-error ts-migrate(2794) FIXME: Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
              ? resolve()
              : reject(new errors.BadRequest({ email: 'Email is invalid' }));
          }, 100);
        });
      };

      fcnPromiseSanitize = (values: any) => new Promise((resolve, reject) => {
        setTimeout(() => {
          values.email.trim() // eslint-disable-line no-unused-expressions
            ? resolve(Object.assign(values, { email: values.email.trim() }))
            : reject(new errors.BadRequest({ email: 'Email is invalid' }));
        }, 100);
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('test passes on correct data', (next: any) => {
      hooks.validate(fcnPromise)(hookOk)
        .then((hook: any) => {
          assert.deepEqual(hook, origHookOk);
          assert.deepEqual(fcnHook, origHookOk);
          next();
        })
        .catch((err: any) => next(err));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('test can sanitize correct data', (next: any) => {
      hooks.validate(fcnPromiseSanitize)(hookOk)
        .then((hook: any) => {
          assert.equal(hook.data.email, 'a@a.com');
          next();
        })
        .catch((err: any) => next(err));
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('test fails on errors', (next: any) => {
      hooks.validate(fcnPromiseSanitize)(hookBad)
        .then(() => {
          assert.fail(true, false, 'test should not have completed successfully');
        })
        .catch(() => next());
    });
  });
});

// Helpers

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
