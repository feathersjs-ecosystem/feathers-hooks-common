import { assert } from 'vitest';

import sift from 'sift';
import { sifter } from './sifter';
import { clone } from '../../common';

const dataCanada = [
  { name: 'john', address: { city: 'montreal', country: 'canada' } },
  { name: 'david', address: { city: 'vancouver', country: 'canada' } },
];

const dataUsa = [{ name: 'marshall', address: { city: 'utah', country: 'usa' } }];

let context: any;
let contextPaginated: any;

describe('sifter', () => {
  beforeEach(() => {
    const data = [...dataCanada, ...dataUsa];

    context = clone({ type: 'after', method: 'find', result: data });
    contextPaginated = clone({
      type: 'after',
      method: 'find',
      result: { total: 1, limit: 10, skip: 0, data },
    });
  });

  it('sifts non-paginated data', async () => {
    const hook1: any = await sifter(() => sift({ 'address.country': 'canada' }))(context);
    assert.deepEqual(hook1.result, dataCanada);
  });

  it('sifts paginated data', async () => {
    const hook1: any = await sifter(() => sift({ 'address.country': 'canada' }))(contextPaginated);
    assert.deepEqual(hook1.result.data, dataCanada);
  });

  it('throws if getSifter not a function', async () => {
    // @ts-expect-error throws if getSifter not a function
    assert.throws(() => sifter({})(contextPaginated));
  });

  it('throws if getSifter does not return a function', () => {
    // @ts-expect-error throws if getSifter does not return a function
    assert.throws(() => sifter((hook: any) => ({}))(contextPaginated));
  });
});
