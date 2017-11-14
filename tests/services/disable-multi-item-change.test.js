
const {
  assert
} = require('chai');

const {
  disableMultiItemChange
} = require('../../lib/services');

var hookBefore;

['update', 'patch', 'remove'].forEach(method => {
  describe(`services disableMultiItemChange - ${method}`, () => {
    beforeEach(() => {
      hookBefore = {
        type: 'before',
        method,
        params: { provider: 'rest' },
        data: { first: 'John', last: 'Doe' },
        id: null
      };
    });

    it('allows non null id', () => {
      hookBefore.id = 1;

      const result = disableMultiItemChange()(hookBefore);
      assert.equal(result, undefined);
    });

    it('throws on null id', () => {
      hookBefore.id = null;

      assert.throws(() => { disableMultiItemChange()(hookBefore); });
    });

    it('throws if after hook', () => {
      hookBefore.id = 1;
      hookBefore.type = 'after';

      assert.throws(() => { disableMultiItemChange()(hookBefore); });
    });
  });
});

['find', 'get', 'create'].forEach(method => {
  ['before', 'after'].forEach(type => {
    describe(`services disableMultiItemChange - ${method} ${type}`, () => {
      it('throws', () => {
        hookBefore.id = 1;
        hookBefore.method = method;
        hookBefore.type = type;

        assert.throws(() => { disableMultiItemChange()(hookBefore); });
      });
    });
  });
});
