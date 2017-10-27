const {
  assert
} = require('chai');

const hooks = require('../../lib/filters');

const hookNames = [
  'combine',
  'pluck',
  'remove',
  'setFilteredAt',
  'traverse',
  'iffElse',
  'iff',
  'when',
  'unless',
  'some',
  'every',
  'isNot'
].sort();

describe('services exposed hooks', () => {
  it('expected hooks are exposed', () => {

  });

  it('no unexpected hooks', () => {
    assert.deepEqual(
      Object.keys(hooks).sort(),
      hookNames
    );
  });
});
