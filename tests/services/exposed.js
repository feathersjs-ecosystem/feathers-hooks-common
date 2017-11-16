const {
  assert
} = require('chai');

const hooks = require('../../lib');

const hookNames = [
  'callbackToPromise',
  'checkContext',
  'checkContextIf',
  'client',
  'combine',
  'debug',
  'deleteByDot',
  'dePopulate',
  'disable',
  'disallow',
  'disableMultiItemChange',
  'discard',
  'existsByDot',
  'fastJoin',
  'getByDot',
  'getItems',
  'isProvider',
  'keep',
  'lowerCase',
  'makeCallingParams',
  'paramsForServer',
  'paramsFromClient',
  'populate',
  'pluck',
  'pluckQuery',
  'preventChanges',
  'promiseToCallback',
  'removeQuery',
  'replaceItems',
  'serialize',
  'setByDot',
  'setCreatedAt',
  'setNow',
  'setSlug',
  'setUpdatedAt',
  'sifter',
  'softDelete',
  'stashBefore',
  'thenifyHook',
  'traverse',
  'validate',
  'validateSchema',
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
    console.log(Object.keys(hooks).sort());
    console.log(hookNames);
    assert.deepEqual(
      Object.keys(hooks).sort(),
      [].concat(hookNames, 'default').sort()
    );
  });
});
