
import assert from 'assert';
import filter from '../../../src/filters';

describe('filter traverse', () => {
  let data;
  let dataArray;
  let dataComplex;
  let trimmer;

  beforeEach(() => {
    data = { a: ' a  b  ' };
    dataArray = [{ a: ' a  b  ' }, { c: ' c ' }];
    dataComplex = { query: { b: ' b  b  ' }, something: { c: '  c  ', d: 'd' } };

    trimmer = function (node) {
      if (typeof node === 'string') {
        this.update(node.trim());
      }
    };
  });

  it('transforms 1 item', () => {
    filter.traverse(trimmer)(data);
    assert.deepEqual(data, { a: 'a  b' });
  });

  it('transforms array of items', () => {
    filter.traverse(trimmer)(dataArray);
    assert.deepEqual(dataArray, [{ a: 'a  b' }, { c: 'c' }]);
  });

  it('transforms multiple objects within a hook', () => {
    filter.traverse(trimmer,
      data => [data.query, data.something]
    )(dataComplex);

    assert.deepEqual(dataComplex, { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } });
  });

  it('transforms objects', () => {
    filter.traverse(trimmer, dataComplex)(dataArray);

    assert.deepEqual(dataComplex, { query: { b: 'b  b' }, something: { c: 'c', d: 'd' } });
  });
});
