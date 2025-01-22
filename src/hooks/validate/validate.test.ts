import { assert, expect } from 'vitest';
import { validate } from './validate';
import { BadRequest } from '@feathersjs/errors';
import { clone } from '../../common';

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
              : // @ts-ignore
                reject(new BadRequest({ email: 'Email is invalid' }));
          }, 100);
        });
      };

      fcnPromiseSanitize = (values: any) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            values.email.trim()
              ? resolve(Object.assign(values, { email: values.email.trim() }))
              : // @ts-ignore
                reject(new BadRequest({ email: 'Email is invalid' }));
          }, 100);
        });
    });

    it('test passes on correct data', async () => {
      const result = await validate(fcnPromise)(hookOk);

      assert.deepEqual(result, origHookOk);
      assert.deepEqual(fcnHook, origHookOk);
    });

    it('test can sanitize correct data', async () => {
      const result = await validate(fcnPromiseSanitize)(hookOk);

      assert.equal(result.data.email, 'a@a.com');
    });

    it('test fails on errors', async () => {
      await expect(validate(fcnPromiseSanitize)(hookBad)).rejects.toThrow();
    });
  });
});
