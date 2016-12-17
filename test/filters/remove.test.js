if (!global._babelPolyfill) { require('babel-polyfill'); }

import { assert } from 'chai';
import filter from '../../src/filters';

var data;
var dataArray;

describe('filter remove', () => {
  describe('removes fields', () => {
    beforeEach(() => {
      data = { first: 'John', last: 'Doe' };
      dataArray = [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doety' }
      ];
    });

    it('updates data', () => {
      const result = filter.remove('first')(data);
      assert.deepEqual(result, { last: 'Doe' });
    });

    it('updates data array', () => {
      const result = filter.remove('first')(dataArray);
      assert.deepEqual(result, [{ last: 'Doe' }, { last: 'Doety' }]);
    });

    it('does not throw if field is missing', () => {
      const data = { first: 'John', last: 'Doe' };
      const result = filter.remove('first', 'xx')(data);
      assert.deepEqual(result, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const data = { first: undefined, last: 'Doe' };
      const result = filter.remove('first')(data);
      assert.deepEqual(result, { first: undefined, last: 'Doe' }); // todo note this
    });

    it('does not throw if field is null', () => {
      const data = { first: null, last: 'Doe' };
      const result = filter.remove('first')(data);
      assert.deepEqual(result, { last: 'Doe' });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      data = { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' };
    });

    it('prop with no dots', () => {
      const result = filter.remove('dept')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('prop with 1 dot', () => {
      const result = filter.remove('empl.status')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' } }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      const result = filter.remove('empl.name.first')(data);
      assert.deepEqual(result,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing paths', () => {
      const result = filter.remove('empl.xx.first')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      const result = filter.remove('xx')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });
  });
});
