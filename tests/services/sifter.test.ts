
const {
  // @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
  assert
} = require('chai');

const sift = require('sift').default;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
const hooks = require('../../lib/services');

const dataCanada = [
  { name: 'john', address: { city: 'montreal', country: 'canada' } },
  { name: 'david', address: { city: 'vancouver', country: 'canada' } }
];

const dataUsa = [
  { name: 'marshall', address: { city: 'utah', country: 'usa' } }
];

// @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
const data = [].concat(dataCanada, dataUsa);

const origHook = { type: 'after', method: 'find', result: data };

const origHookPaginated = {
  type: 'after',
  method: 'find',
  result: { total: 1, limit: 10, skip: 0, data }
};

const getCountry = (country: any) => (hook: any) => sift({ 'address.country': country });

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook;
let hookPaginated: any;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services shifter', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hook = clone(origHook);
    hookPaginated = clone(origHookPaginated);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sifts non-paginated data', () => {
    const hook1 = hooks.sifter(getCountry('canada'))(hook);
    assert.deepEqual(hook1.result, dataCanada);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('sifts paginated data', () => {
    const hook1 = hooks.sifter(getCountry('canada'))(hookPaginated);
    assert.deepEqual(hook1.result.data, dataCanada);
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if getSifter not a function', () => {
    assert.throws(() => hooks.sifter({})(hookPaginated));
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('throws if getSifter does not return a function', () => {
    assert.throws(() => hooks.sifter((hook: any) => ({}))(hookPaginated));
  });
});

// Helpers

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
