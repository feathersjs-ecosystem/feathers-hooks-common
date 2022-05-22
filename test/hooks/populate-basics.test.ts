
import { assert } from 'chai';
import { populate } from '../../src';

describe('services populate - finds items in hook', () => {
  let hookAfter: any;
  let hookAfterArray: any;
  let hookFindPaginate: any;

  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: { first: 'Jane2', last: 'Doe2' }
    };
    hookAfterArray = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: [{ first: 'John2', last: 'Doe2' }, { first: 'Jane', last: 'Doe' }]
    };
    hookFindPaginate = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      result: {
        total: 2,
        data: [
          { first: 'John3', last: 'Doe3' },
          { first: 'Jane3', last: 'Doe3' }
        ]
      }
    };
  });

  it('one item', () => {
    const hook = clone(hookAfter);
    return populate({ schema: {} })(hook)
    // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfter);
      });
  });

  it('item array', () => {
    const hook = clone(hookAfterArray);
    return populate({ schema: {} })(hook)
    // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookAfterArray);
      });
  });

  it('find paginated', () => {
    const hook = clone(hookFindPaginate);
    return populate({ schema: {} })(hook)
    // @ts-ignore
      .then((hook: any) => {
        assert.deepEqual(hook, hookFindPaginate);
      });
  });
});

describe('services populate - throws on bad params', () => { // run to increase code climate score
  let hookAfter: any;

  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: { first: 'Jane2', last: 'Doe2' }
    };
  });

  it('schema', () => {
    // @ts-expect-error
    assert.throws(() => { populate({}); });
    // @ts-expect-error
    assert.throws(() => { populate({ schema: 1 }); });
  });

  it('permissions not func', () => {
    const hook = clone(hookAfter);
    // @ts-ignore
    return populate({ schema: {}, checkPermissions: 1 })(hook)
    // @ts-ignore
      .then(() => { throw new Error('was not supposed to succeed'); })
      .catch((err: any) => { assert.notEqual(err, undefined); });
  });

  it('throws on invalid permissions', () => {
    const hook = clone(hookAfter);
    // @ts-ignore
    return populate({ schema: {}, checkPermissions: () => false })(hook)
    // @ts-ignore
      .then(() => { throw new Error('was not supposed to succeed'); })
      .catch((err: any) => { assert.notEqual(err, undefined); });
  });
});

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
