if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import filters from '../../src/filters';

const filterFalse = () => () => {
  return false;
};

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

describe('filters combine', () => {
  let data;
  let connection;
  let hook;

  beforeEach(() => {
    data = { a: 'a', callers: [] };
    connection = { aa: 'aa' };
    hook = { type: 'create' };
  });

  it('returns false from 1 filter', () => {
    return filters.combine(
      filterFalse()
    )(cloneParams(data, connection, hook))
      .then(result => {
        assert.strictEqual(result, false);
      });
  });

  it('returns data from 1 filter', () => {
    return filters.combine(
      filterPassData1()
    )(cloneParams(data, connection, hook))
      .then(result => {
        assert.deepEqual(result,
          { a: 'a', callers: ['filterPassData1'] }
        );
      });
  });

  it('returns data from multiple filters', () => {
    return filters.combine(
      filterPassData1(), filterPassData2(), filterPassData3()
    )(cloneParams(data, connection, hook))
      .then(result => {
        assert.deepEqual(result,
          { a: 'a', callers: ['filterPassData1', 'filterPassData2', 'filterPassData3'] }
        );
      });
  });

  it('returns false from multiple filters', () => {
    return filters.combine(
      filterPassData1(), filterPassData2(), filterFalse(), filterPassData3()
    )(cloneParams(data, connection, hook))
      .then(result => {
        assert.strictEqual(result, false);
      });
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

function cloneParams (data, connection, hook) {
  return [clone(data), clone(connection), clone(hook)];
}
