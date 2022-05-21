import { assert } from 'chai';
import { validate } from '../../src';
import { BadRequest } from '@feathersjs/errors';

let fcnSync: any;
let fcnPromise: any;
let fcnPromiseSanitize: any;
let origHookOk: any;
let origHookBad: any;
let hookOk: any;
let hookBad: any;
let fcnHook: any;

describe('services validate', () => {
  origHookOk = { type: 'before', method: 'create', data: { email: ' a@a.com ' } };
  origHookBad = { type: 'before', method: 'create', data: { email: '' } };

  describe('Sync function', () => {
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);
      fcnHook = {};

      fcnSync = (values: any, hook: any) => {
        fcnHook = hook;

        return values.email.trim() ? null : { email: 'Email is invalid' };
      };
    });

    it('test passes on correct data', () => {
      const hook = validate(fcnSync)(hookOk);
      assert.deepEqual(hook, origHookOk);
      assert.deepEqual(fcnHook, origHookOk);
    });

    it('test fails on errors', () => {
      assert.throws(() => validate(fcnSync)(hookBad));
    });
  });

  describe('Promise function', () => {
    beforeEach(() => {
      hookOk = clone(origHookOk);
      hookBad = clone(origHookBad);
      fcnHook = {};

      fcnPromise = (values: any, hook: any) => {
        fcnHook = hook;

        return new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            values.email.trim()
              ? resolve()
              // @ts-ignore
              : reject(new BadRequest({ email: 'Email is invalid' }));
          }, 100);
        });
      };

      fcnPromiseSanitize = (values: any) => new Promise((resolve, reject) => {
        setTimeout(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          values.email.trim()
            ? resolve(Object.assign(values, { email: values.email.trim() }))
            // @ts-ignore
            : reject(new BadRequest({ email: 'Email is invalid' }));
        }, 100);
      });
    });

    it('test passes on correct data', (next: any) => {
      validate(fcnPromise)(hookOk)
        // @ts-ignore
        .then((hook: any) => {
          assert.deepEqual(hook, origHookOk);
          assert.deepEqual(fcnHook, origHookOk);
          next();
        })
        .catch((err: any) => next(err));
    });

    it('test can sanitize correct data', (next: any) => {
      validate(fcnPromiseSanitize)(hookOk)
        // @ts-ignore
        .then((hook: any) => {
          assert.equal(hook.data.email, 'a@a.com');
          next();
        })
        .catch((err: any) => next(err));
    });

    it('test fails on errors', (next: any) => {
      validate(fcnPromiseSanitize)(hookBad)
        // @ts-ignore
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
