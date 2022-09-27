import { assert } from 'chai';

import sift from 'sift';
import { sifter } from '../../src';

const dataCanada = [
  { name: 'john', address: { city: 'montreal', country: 'canada' } },
  { name: 'david', address: { city: 'vancouver', country: 'canada' } },
];

const dataUsa = [{ name: 'marshall', address: { city: 'utah', country: 'usa' } }];

const data = ([] as any[]).concat(dataCanada, dataUsa);

const origHook = { type: 'after', method: 'find', result: data };

const origHookPaginated = {
  type: 'after',
  method: 'find',
  result: { total: 1, limit: 10, skip: 0, data },
};

const getCountry = (country: any) => (_hook: any) => sift({ 'address.country': country });

let hook: any;
let hookPaginated: any;

describe('services shifter', () => {
  beforeEach(() => {
    hook = clone(origHook);
    hookPaginated = clone(origHookPaginated);
  });

  it('sifts non-paginated data', () => {
    const hook1: any = sifter(getCountry('canada'))(hook);
    assert.deepEqual(hook1.result, dataCanada);
  });

  it('sifts paginated data', () => {
    const hook1: any = sifter(getCountry('canada'))(hookPaginated);
    assert.deepEqual(hook1.result.data, dataCanada);
  });

  it('throws if getSifter not a function', () => {
    // @ts-expect-error throws if getSifter not a function
    assert.throws(() => sifter({})(hookPaginated));
  });

  it('throws if getSifter does not return a function', () => {
    // @ts-expect-error throws if getSifter does not return a function
    assert.throws(() => sifter((hook: any) => ({}))(hookPaginated));
  });
});

// Helpers

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
