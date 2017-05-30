
import { assert } from 'chai';
import filters from '../../src/filters';

var data;
var dataArray;
var dataComplex;

describe('filters setFilteredAt', () => {
  describe('adds field', () => {
    beforeEach(() => {
      data = { first: 'John', last: 'Doe' };
      dataArray = [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Doe' }];
    });

    it('updates single item', () => {
      const result = filters.setFilteredAt()(data);
      checkData(result, { first: 'John', last: 'Doe' }, 'filteredAt');
    });

    it('updates array of items', () => {
      const result = filters.setFilteredAt()(dataArray);

      checkData(result[0], { first: 'John', last: 'Doe' }, 'filteredAt');
      checkData(result[1], { first: 'Jane', last: 'Doe' }, 'filteredAt');
    });
  });

  describe('handles dot notation', () => {
    beforeEach(() => {
      data = { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' };
      dataComplex = {
        empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
        dept: 'Acct',
        created: { where: 'NYC' }
      };
    });

    it('`1 prop with no dots', () => {
      const result = filters.setFilteredAt('madeAt')(data);
      checkData(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , 'madeAt');
    });

    it('2 props with no dots', () => {
      const result = filters.setFilteredAt('madeAt', 'builtAt')(data);
      checkData(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
        , ['madeAt', 'builtAt']);
    });

    it('prop with 1 dot', () => {
      const result = filters.setFilteredAt('created.at')(data);
      assert.instanceOf(result.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(result.created).length, 1);
      delete result.created;
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });

    it('prop with 1 dot in existing obj', () => {
      filters.setFilteredAt('created.at')(dataComplex);
      assert.instanceOf(dataComplex.created.at, Date, 'not instance of Date');
      assert.equal(Object.keys(dataComplex.created).length, 2);
      delete dataComplex.created.at;
      assert.deepEqual(dataComplex,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' },
          dept: 'Acct',
          created: { where: 'NYC' }
        }
      );
    });

    it('prop with 2 dots', () => {
      const result = filters.setFilteredAt('created.at.time')(data);
      assert.instanceOf(result.created.at.time, Date, 'not instance of Date');
      assert.equal(Object.keys(result.created.at).length, 1);
      assert.equal(Object.keys(result.created).length, 1);
      delete result.created;
      assert.deepEqual(result,
        { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' }
      );
    });
  });

  describe('time advances', () => {
    beforeEach(() => {
      data = { type: 'before', method: 'create', data: { first: 'John', last: 'Doe' } };
    });

    it('for 2 filters', next => {
      const result = filters.setFilteredAt()(data);
      const firstTime = result.filteredAt;

      setTimeout(() => {
        filters.setFilteredAt()(data);
        assert.isAbove(result.filteredAt.getTime(), firstTime.getTime());
        next();
      }, 50);
    });
  });
});

// Helpers

function checkData (item, template, dateFields) {
  const item1 = clone(item);
  if (typeof dateFields === 'string') {
    dateFields = [dateFields];
  }

  dateFields.forEach(dateField => {
    assert.instanceOf(item[dateField], Date, 'not instance of Date');
    delete item1[dateField];
  });

  assert.deepEqual(item1, template, 'objects differ');
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
