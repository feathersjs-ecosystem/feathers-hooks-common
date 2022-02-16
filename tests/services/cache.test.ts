
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cache'.
const { cache } = require('../../lib/services');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'CacheMap'.
const CacheMap = require('@feathers-plus/cache');

let cacheMap: any;
let hookBeforeSingle: any;
let hookBeforeMulti: any;
let hookAfterSingle: any;
let hookAfterSingleNormalize: any;
let hookAfterMulti: any;
let hookAfterPaginated: any;
let hookBeforeUuid: any;
let hookAfterUuid: any;
let hookBeforeMultiMixed: any;
let hookAfterMultiMixed: any;
let map: any;
let cloneCount: any;

const makeCacheKey = (key: any) => -key;

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('service cache', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    cacheMap = CacheMap({ max: 3 });
    map = new Map();
    cloneCount = 0;

    hookBeforeSingle = {
      type: 'before',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      data: { id: 1, first: 'John', last: 'Doe' }
    };
    hookBeforeMulti = {
      type: 'before',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      data: [
        { id: 1, first: 'John', last: 'Doe' },
        { id: 2, first: 'Jane', last: 'Doe' }
      ]
    };
    hookAfterSingle = {
      type: 'after',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      result: { id: 1, first: 'Jane', last: 'Doe' }
    };
    hookAfterSingleNormalize = {
      type: 'after',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      result: { id: -1, first: 'Jane', last: 'Doe' }
    };
    hookAfterMulti = {
      type: 'after',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      result: [
        { id: 1, first: 'John', last: 'Doe' },
        { id: 2, first: 'Jane', last: 'Doe' }
      ]
    };
    hookAfterPaginated = {
      type: 'after',
      method: 'find',
      params: { provider: 'rest' },
      result: {
        total: 2,
        data: [
          { id: 1, first: 'John', last: 'Doe' },
          { id: 2, first: 'Jane', last: 'Doe' }
        ]
      }
    };
    hookBeforeUuid = {
      type: 'before',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      data: { uuid: 1, first: 'John', last: 'Doe' },
      service: { id: 'uuid' }
    };
    hookAfterUuid = {
      type: 'after',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      result: { uuid: 1, first: 'Jane', last: 'Doe' },
      service: { id: 'uuid' }
    };
    hookBeforeMultiMixed = {
      type: 'before',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      data: [
        { _id: 1, first: 'John', last: 'Doe' },
        { id: 2, first: 'Jane', last: 'Doe' }
      ]
    };
    hookAfterMultiMixed = {
      type: 'after',
      id: undefined,
      method: undefined,
      params: { provider: 'rest' },
      result: [
        { id: 1, first: 'John', last: 'Doe' },
        { _id: 2, first: 'Jane', last: 'Doe' }
      ]
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Can build a cache', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Can build a cache', () => {
      cacheMap.set('a', 'aa');
      assert.equal(cacheMap.get('a'), 'aa', 'bad get after set');

      cacheMap.delete('a');
      assert.equal(cacheMap.get('a'), undefined, 'bad get after delete');

      cacheMap.set('a', 'aa');
      cacheMap.clear();
      assert.equal(cacheMap.get('a'), undefined, 'bad get after clear');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Clears cache', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Before one-record update', () => {
      hookBeforeSingle.method = 'update';

      cacheMap.set(1, 123);

      cache(cacheMap, 'id')(hookBeforeSingle);
      assert.deepEqual(cacheMap.get(1), undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Before multi-record update', () => {
      hookBeforeMulti.method = 'update';

      cacheMap.set(1, 123);
      cacheMap.set(2, 124);

      cache(cacheMap, 'id')(hookBeforeMulti);

      assert.deepEqual(cacheMap.get(1), undefined);
      assert.deepEqual(cacheMap.get(2), undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Before one-record patch', () => {
      hookBeforeSingle.method = 'patch';

      cacheMap.set(1, 123);

      cache(cacheMap, 'id')(hookBeforeSingle);

      assert.deepEqual(cacheMap.get(1), undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Before multi-record patch', () => {
      hookBeforeMulti.method = 'patch';

      cacheMap.set(1, 123);
      cacheMap.set(2, 789);

      cache(cacheMap, 'id')(hookBeforeMulti);
      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('NOT before one-record create', () => {
      hookBeforeSingle.method = 'create';

      cacheMap.set(1, 123);

      cache(cacheMap, 'id')(hookBeforeSingle);
      assert.deepEqual(cacheMap.get(1), 123);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('NOT before multi-record remove', () => {
      hookBeforeMulti.method = 'remove';

      cacheMap.set(1, 123);
      cacheMap.set(2, 321);

      cache(cacheMap, 'id')(hookBeforeMulti);
      assert.deepEqual(cacheMap.get(1), 123);
      assert.deepEqual(cacheMap.get(2), 321);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('After multi-record remove', () => {
      hookAfterMulti.method = 'remove';

      cacheMap.set(1, 123);
      cacheMap.set(2, 321);

      cache(cacheMap, 'id')(hookAfterMulti);

      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Loads cache', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('After one-record create', () => {
      hookAfterSingle.method = 'create';

      cache(cacheMap, 'id')(hookAfterSingle);
      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'Jane', last: 'Doe' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('After multi-record patch', () => {
      hookAfterMulti.method = 'patch';

      cache(cacheMap, 'id')(hookAfterMulti);

      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'John', last: 'Doe' }, 'id 1');
      assert.deepEqual(cacheMap.get(2), { id: 2, first: 'Jane', last: 'Doe' }, 'id 2');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('After paginated find', () => {
      cache(cacheMap, 'id')(hookAfterPaginated);

      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'John', last: 'Doe' }, 'id 1');
      assert.deepEqual(cacheMap.get(2), { id: 2, first: 'Jane', last: 'Doe' }, 'id 2');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('NOT after remove', () => {
      hookAfterMulti.method = 'remove';

      cache(cacheMap, 'id')(hookAfterMulti);

      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Normalizes record', () => {
      hookAfterSingleNormalize.method = 'create';

      cache(cacheMap, 'id', { makeCacheKey })(hookAfterSingleNormalize);
      assert.deepEqual(cacheMap.get(1), { id: -1, first: 'Jane', last: 'Doe' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Gets from cache', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Before one-record get', () => {
      hookBeforeSingle.method = 'get';
      hookBeforeSingle.id = 1;

      cacheMap.set(1, { foo: 'bar' });

      cache(cacheMap, 'id')(hookBeforeSingle);

      assert.deepEqual(cacheMap.get(1), { foo: 'bar' }, 'cache');
      assert.deepEqual(hookBeforeSingle.result, { foo: 'bar' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Normalizes record', () => {
      hookBeforeSingle.method = 'get';
      hookBeforeSingle.id = -1;

      cacheMap.set(1, { id: -1, foo: 'bar' });

      cache(cacheMap, 'id', { makeCacheKey })(hookBeforeSingle);

      assert.deepEqual(cacheMap.get(1), { id: -1, foo: 'bar' }, 'cache');
      assert.deepEqual(hookBeforeSingle.result, { id: -1, foo: 'bar' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Uses context.service.id', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Clears cache before one-record update', () => {
      hookBeforeUuid.method = 'update';

      cacheMap.set(1, 123);

      cache(cacheMap)(hookBeforeUuid);
      assert.deepEqual(cacheMap.get(1), undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Loads cache after one-record create', () => {
      hookAfterUuid.method = 'create';

      cache(cacheMap)(hookAfterUuid);
      assert.deepEqual(cacheMap.get(1), { uuid: 1, first: 'Jane', last: 'Doe' });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Before one-record get', () => {
      hookBeforeUuid.method = 'get';
      hookBeforeUuid.id = 1;

      cacheMap.set(1, { foo: 'bar' });

      cache(cacheMap)(hookBeforeUuid);

      assert.deepEqual(cacheMap.get(1), { foo: 'bar' }, 'cache');
      assert.deepEqual(hookBeforeUuid.result, { foo: 'bar' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Uses item._id || item.id', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Clears cache before multi-record patch', () => {
      hookBeforeMultiMixed.method = 'patch';

      cacheMap.set(1, 123);
      cacheMap.set(2, 789);

      cache(cacheMap)(hookBeforeMultiMixed);
      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Loads cache after multi-record patch', () => {
      hookAfterMultiMixed.method = 'patch';

      cache(cacheMap)(hookAfterMultiMixed);

      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'John', last: 'Doe' }, 'id 1');
      assert.deepEqual(cacheMap.get(2), { _id: 2, first: 'Jane', last: 'Doe' }, 'id 2');
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Works with an ES6 Map', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Clears cache before one-record update', () => {
      hookBeforeUuid.method = 'update';

      map.set(1, 123);

      cache(map)(hookBeforeUuid);
      assert.deepEqual(map.get(1), undefined);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Loads cache after one-record create', () => {
      hookAfterUuid.method = 'create';

      cache(map)(hookAfterUuid);
      assert.deepEqual(map.get(1), { uuid: 1, first: 'Jane', last: 'Doe' });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('Misc', () => {
    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('Uses option.clone', () => {
      hookAfterUuid.method = 'create';

      cache(cacheMap, null, { clone })(hookAfterUuid);
      assert.deepEqual(cacheMap.get(1), { uuid: 1, first: 'Jane', last: 'Doe' }, 'get');
      assert.equal(cloneCount, 1, 'count');
    });
  });
});

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'clone'.
function clone (obj: any) {
  cloneCount += 1;
  return Object.assign({}, obj);
}
