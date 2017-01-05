
import { assert } from 'chai';
import filters from '../../../src/filters';

var predicateParam1, predicateParam2, predicateParam3, predicateParam4;

const filterPassData1 = () => (data) => {
  data.callers.push('filterPassData1');
  return data;
};

const filterPassData2 = () => (data) => {
  data.callers.push('filterPassData2');
  return data;
};

const filterPassData3 = () => (data) => {
  data.callers.push('filterPassData3');
  return data;
};

const predicateTrue = (data, connection, hook, more4) => {
  predicateParam1 = data;
  predicateParam2 = connection;
  predicateParam3 = hook;
  predicateParam4 = more4;

  return true;
};

describe('filters iffElse', () => {
  let data;
  let connection;
  let hook;

  beforeEach(() => {
    data = { a: 'a', callers: [] };
    connection = { aa: 'aa' };
    hook = { type: 'create' };
  });

  describe('runs multiple hooks', () => {
    it('run true eventFilters if predicate true', () => {
      return filters.iffElse(
        true, [filterPassData1(), filterPassData2(), filterPassData3()], null
      )(clone(data), clone(connection), clone(hook))
        .then(result => {
          assert.deepEqual(result,
            { a: 'a', callers: ['filterPassData1', 'filterPassData2', 'filterPassData3'] }
          );
        });
    });

    it('run false eventFilters if predicate false', () => {
      return filters.iffElse(
        false, null, [filterPassData1(), filterPassData2(), filterPassData3()]
      )(clone(data), clone(connection), clone(hook))
        .then(result => {
          assert.deepEqual(result,
            { a: 'a', callers: ['filterPassData1', 'filterPassData2', 'filterPassData3'] }
          );
        });
    });
  });

  describe('predicate gets right params', () => {
    it('when true', () => {
      return filters.iffElse(
        predicateTrue, [filterPassData1(), filterPassData2(), filterPassData3()], null
      )(data, connection, hook)
        .then(() => {
          assert.deepEqual(predicateParam1, data, 'param1');
          assert.strictEqual(predicateParam2, connection, 'param2');
          assert.strictEqual(predicateParam3, hook, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('every passes on correct params', () => {
      return filters.iffElse(
        filters.every(predicateTrue), [filterPassData1(), filterPassData2(), filterPassData3()], null
      )(data, connection, hook)
        .then(() => {
          assert.deepEqual(predicateParam1, data, 'param1');
          assert.strictEqual(predicateParam2, connection, 'param2');
          assert.strictEqual(predicateParam3, hook, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });

    it('some passes on correct params', () => {
      return filters.iffElse(
        filters.some(predicateTrue), [filterPassData1(), filterPassData2(), filterPassData3()], null
      )(data, connection, hook)
        .then(() => {
          assert.deepEqual(predicateParam1, data, 'param1');
          assert.strictEqual(predicateParam2, connection, 'param2');
          assert.strictEqual(predicateParam3, hook, 'param3');
          assert.strictEqual(predicateParam4, undefined, 'param4');
        });
    });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
