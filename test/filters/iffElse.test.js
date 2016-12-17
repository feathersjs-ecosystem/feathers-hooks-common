if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import filters from '../../src/filters';

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

describe('filters iffElse', () => {
  let data;
  let connection;
  let hook;

  beforeEach(() => {
    data = { a: 'a', callers: [] };
    connection = { aa: 'aa' };
    hook = { type: 'create' };
  });

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

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
