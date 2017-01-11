// test what hooks are exposed

import { assert } from 'chai';
import hooks from '../../src/permissions';

const hookNames = [
  'combine',
  'iffElse',
  'iff',
  'when',
  'unless',
  'some',
  'every',
  'isNot'
].sort();

describe('permission exposed hooks', () => {
  it('expected hooks are exposed', () => {

  });

  it('no unexpected hooks', () => {
    assert.deepEqual(
      Object.keys(hooks).sort(),
      hookNames
    );
  });
});
