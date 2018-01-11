
const {
  assert
} = require('chai');

const {
  disableMultiItemCreate
} = require('../../lib/services');

var hookBefore;

['create'].forEach(method => {
  describe(`services disableMultiItemCreate - ${method}`, () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method,
        params: { provider: 'rest' }
      };
    });

    it('allows non-array data', () => {
      hookBefore.data = { first: 'John', last: 'Doe' };

      const result = disableMultiItemCreate()(hookBefore);
      assert.equal(result, undefined);
    });

    it('throws on array data', () => {
      hookBefore.data = [{ first: 'John', last: 'Doe' }, { first: 'John', last: 'Doe' }];

      assert.throws(() => { disableMultiItemCreate()(hookBefore); });
    });

    it('throws if after hook', () => {
      hookBefore.data = { first: 'John', last: 'Doe' };
      hookBefore.type = 'after';

      assert.throws(() => { disableMultiItemCreate()(hookBefore); });
    });
  });
});

['find', 'get', 'update', 'patch', 'remove'].forEach(method => {
  ['before', 'after'].forEach(type => {
    describe(`services disableMultiItemCreate - ${method} ${type}`, () => {
      it('throws', () => {
        hookBefore.data = { first: 'John', last: 'Doe' };
        hookBefore.method = method;
        hookBefore.type = type;

        assert.throws(() => { disableMultiItemCreate()(hookBefore); });
      });
    });
  });
});
