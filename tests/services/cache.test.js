
const { assert } = require('chai');
const { cache } = require('../../lib/services');
const CacheMap = require('@feathers-plus/cache');

let cacheMap;
let hookBeforeSingle;
let hookBeforeMulti;
let hookAfterSingle;
let hookAfterSingleNormalize;
let hookAfterMulti;
let hookAfterPaginated;
let hookBeforeUuid;
let hookAfterUuid;
let hookBeforeMultiMixed;
let hookAfterMultiMixed;
let map;
let cloneCount;

const makeCacheKey = key => -key;

describe('service cache', () => {
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

  describe('Can build a cache', () => {
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

  describe('Clears cache', () => {
    it('Before one-record update', () => {
      hookBeforeSingle.method = 'update';

      cacheMap.set(1, 123);

      cache(cacheMap, 'id')(hookBeforeSingle);
      assert.deepEqual(cacheMap.get(1), undefined);
    });

    it('Before multi-record update', () => {
      hookBeforeMulti.method = 'update';

      cacheMap.set(1, 123);
      cacheMap.set(2, 124);

      cache(cacheMap, 'id')(hookBeforeMulti);

      assert.deepEqual(cacheMap.get(1), undefined);
      assert.deepEqual(cacheMap.get(2), undefined);
    });

    it('Before one-record patch', () => {
      hookBeforeSingle.method = 'patch';

      cacheMap.set(1, 123);

      cache(cacheMap, 'id')(hookBeforeSingle);

      assert.deepEqual(cacheMap.get(1), undefined);
    });

    it('Before multi-record patch', () => {
      hookBeforeMulti.method = 'patch';

      cacheMap.set(1, 123);
      cacheMap.set(2, 789);

      cache(cacheMap, 'id')(hookBeforeMulti);
      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });

    it('NOT before one-record create', () => {
      hookBeforeSingle.method = 'create';

      cacheMap.set(1, 123);

      cache(cacheMap, 'id')(hookBeforeSingle);
      assert.deepEqual(cacheMap.get(1), 123);
    });

    it('NOT before multi-record remove', () => {
      hookBeforeMulti.method = 'remove';

      cacheMap.set(1, 123);
      cacheMap.set(2, 321);

      cache(cacheMap, 'id')(hookBeforeMulti);
      assert.deepEqual(cacheMap.get(1), 123);
      assert.deepEqual(cacheMap.get(2), 321);
    });

    it('After multi-record remove', () => {
      hookAfterMulti.method = 'remove';

      cacheMap.set(1, 123);
      cacheMap.set(2, 321);

      cache(cacheMap, 'id')(hookAfterMulti);

      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });
  });

  describe('Loads cache', () => {
    it('After one-record create', () => {
      hookAfterSingle.method = 'create';

      cache(cacheMap, 'id')(hookAfterSingle);
      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'Jane', last: 'Doe' });
    });

    it('After multi-record patch', () => {
      hookAfterMulti.method = 'patch';

      cache(cacheMap, 'id')(hookAfterMulti);

      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'John', last: 'Doe' }, 'id 1');
      assert.deepEqual(cacheMap.get(2), { id: 2, first: 'Jane', last: 'Doe' }, 'id 2');
    });

    it('After paginated find', () => {
      cache(cacheMap, 'id')(hookAfterPaginated);

      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'John', last: 'Doe' }, 'id 1');
      assert.deepEqual(cacheMap.get(2), { id: 2, first: 'Jane', last: 'Doe' }, 'id 2');
    });

    it('NOT after remove', () => {
      hookAfterMulti.method = 'remove';

      cache(cacheMap, 'id')(hookAfterMulti);

      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });

    it('Normalizes record', () => {
      hookAfterSingleNormalize.method = 'create';

      cache(cacheMap, 'id', { makeCacheKey })(hookAfterSingleNormalize);
      assert.deepEqual(cacheMap.get(1), { id: -1, first: 'Jane', last: 'Doe' });
    });
  });

  describe('Gets from cache', () => {
    it('Before one-record get', () => {
      hookBeforeSingle.method = 'get';
      hookBeforeSingle.id = 1;

      cacheMap.set(1, { foo: 'bar' });

      cache(cacheMap, 'id')(hookBeforeSingle);

      assert.deepEqual(cacheMap.get(1), { foo: 'bar' }, 'cache');
      assert.deepEqual(hookBeforeSingle.result, { foo: 'bar' });
    });

    it('Normalizes record', () => {
      hookBeforeSingle.method = 'get';
      hookBeforeSingle.id = -1;

      cacheMap.set(1, { id: -1, foo: 'bar' });

      cache(cacheMap, 'id', { makeCacheKey })(hookBeforeSingle);

      assert.deepEqual(cacheMap.get(1), { id: -1, foo: 'bar' }, 'cache');
      assert.deepEqual(hookBeforeSingle.result, { id: -1, foo: 'bar' });
    });
  });

  describe('Uses context.service.id', () => {
    it('Clears cache before one-record update', () => {
      hookBeforeUuid.method = 'update';

      cacheMap.set(1, 123);

      cache(cacheMap)(hookBeforeUuid);
      assert.deepEqual(cacheMap.get(1), undefined);
    });

    it('Loads cache after one-record create', () => {
      hookAfterUuid.method = 'create';

      cache(cacheMap)(hookAfterUuid);
      assert.deepEqual(cacheMap.get(1), { uuid: 1, first: 'Jane', last: 'Doe' });
    });

    it('Before one-record get', () => {
      hookBeforeUuid.method = 'get';
      hookBeforeUuid.id = 1;

      cacheMap.set(1, { foo: 'bar' });

      cache(cacheMap)(hookBeforeUuid);

      assert.deepEqual(cacheMap.get(1), { foo: 'bar' }, 'cache');
      assert.deepEqual(hookBeforeUuid.result, { foo: 'bar' });
    });
  });

  describe('Uses item._id || item.id', () => {
    it('Clears cache before multi-record patch', () => {
      hookBeforeMultiMixed.method = 'patch';

      cacheMap.set(1, 123);
      cacheMap.set(2, 789);

      cache(cacheMap)(hookBeforeMultiMixed);
      assert.deepEqual(cacheMap.get(1), undefined, 'id 1');
      assert.deepEqual(cacheMap.get(2), undefined, 'id 2');
    });

    it('Loads cache after multi-record patch', () => {
      hookAfterMultiMixed.method = 'patch';

      cache(cacheMap)(hookAfterMultiMixed);

      assert.deepEqual(cacheMap.get(1), { id: 1, first: 'John', last: 'Doe' }, 'id 1');
      assert.deepEqual(cacheMap.get(2), { _id: 2, first: 'Jane', last: 'Doe' }, 'id 2');
    });
  });

  describe('Works with an ES6 Map', () => {
    it('Clears cache before one-record update', () => {
      hookBeforeUuid.method = 'update';

      map.set(1, 123);

      cache(map)(hookBeforeUuid);
      assert.deepEqual(map.get(1), undefined);
    });

    it('Loads cache after one-record create', () => {
      hookAfterUuid.method = 'create';

      cache(map)(hookAfterUuid);
      assert.deepEqual(map.get(1), { uuid: 1, first: 'Jane', last: 'Doe' });
    });
  });

  describe('Misc', () => {
    it('Uses option.clone', () => {
      hookAfterUuid.method = 'create';

      cache(cacheMap, null, { clone })(hookAfterUuid);
      assert.deepEqual(cacheMap.get(1), { uuid: 1, first: 'Jane', last: 'Doe' }, 'get');
      assert.equal(cloneCount, 1, 'count');
    });
  });
});

function clone (obj) {
  cloneCount += 1;
  return Object.assign({}, obj);
}
