
const {
  assert
} = require('chai');

const filters = require('../../lib/filters');

var data;
var dataArray;

describe('filters pluck', () => {
  describe('plucks fields', () => {
    beforeEach(() => {
      data = { first: 'John', last: 'Doe' };
      dataArray = [
        { first: 'John', last: 'Doe' },
        { first: 'Jane', last: 'Doety' }
      ];
    });

    it('updates data', () => {
      const result = filters.pluck('last')(data);
      assert.deepEqual(result, { last: 'Doe' });
    });

    it('updates data array', () => {
      const result = filters.pluck('last')(dataArray);
      assert.deepEqual(result, [{ last: 'Doe' }, { last: 'Doety' }]);
    });

    it('does not throw if field is missing', () => {
      const data = { first: 'John', last: 'Doe' };
      const result = filters.pluck('last', 'xx')(data);
      assert.deepEqual(result, { last: 'Doe' });
    });

    it('does not throw if field is undefined', () => {
      const data = { first: undefined, last: undefined };
      const result = filters.pluck('first')(data);
      assert.deepEqual(result, {}); // todo note this
    });

    it('does not throw if field is null', () => {
      const data = { first: null, last: null };
      const result = filters.pluck('last')(data);
      assert.deepEqual(result, { last: null });
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      data = { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' };
    });

    it('prop with no dots', () => {
      const result = filters.pluck('empl')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('prop with 1 dot', () => {
      const result = filters.pluck('empl.status', 'dept')(data);
      assert.deepEqual(result,
        { empl: { status: 'AA' }, dept: 'Acct' }
      );
    });

    it('prop with 2 dots', () => {
      const result = filters.pluck('empl.name.last', 'empl.status', 'dept')(data);
      assert.deepEqual(result,
        { empl: { name: { last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('overlapping fields', () => {
      const result = filters.pluck('empl.name.last', 'empl', 'empl.status')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });

    it('ignores bad or missing paths', () => {
      const result = filters.pluck('empl.xx.first', 'dept')(data);
      assert.deepEqual(result,
        { dept: 'Acct' }
      );
    });

    it('ignores bad or missing no dot path', () => {
      const result = filters.pluck('xx', 'empl')(data);
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' } }
      );
    });
  });
});
