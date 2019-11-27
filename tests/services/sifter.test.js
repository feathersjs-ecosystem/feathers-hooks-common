
const {
  assert
} = require('chai');

const sift = require('sift').default;
const hooks = require('../../lib/services');

const dataCanada = [
  { name: 'john', address: { city: 'montreal', country: 'canada' } },
  { name: 'david', address: { city: 'vancouver', country: 'canada' } }
];

const dataUsa = [
  { name: 'marshall', address: { city: 'utah', country: 'usa' } }
];

const data = [].concat(dataCanada, dataUsa);

const origHook = { type: 'after', method: 'find', result: data };

const origHookPaginated = {
  type: 'after',
  method: 'find',
  result: { total: 1, limit: 10, skip: 0, data }
};

const getCountry = country => hook => sift({ 'address.country': country });

let hook;
let hookPaginated;

describe('services shifter', () => {
  beforeEach(() => {
    hook = clone(origHook);
    hookPaginated = clone(origHookPaginated);
  });

  it('sifts non-paginated data', () => {
    const hook1 = hooks.sifter(getCountry('canada'))(hook);
    assert.deepEqual(hook1.result, dataCanada);
  });

  it('sifts paginated data', () => {
    const hook1 = hooks.sifter(getCountry('canada'))(hookPaginated);
    assert.deepEqual(hook1.result.data, dataCanada);
  });

  it('throws if getSifter not a function', () => {
    assert.throws(() => hooks.sifter({})(hookPaginated));
  });

  it('throws if getSifter does not return a function', () => {
    assert.throws(() => hooks.sifter(hook => ({}))(hookPaginated));
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
