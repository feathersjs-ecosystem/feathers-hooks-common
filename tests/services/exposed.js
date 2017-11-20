
const { assert } = require('chai');
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
  'runHook',
  'serialize',
  'setByDot',
  'setCreatedAt',
  'setNow',
  'setSlug',
  'setUpdatedAt',
  'sifter',
  'softDelete',
  'stashBefore',
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
    assert.deepEqual(
      Object.keys(hooks).sort(),
      [].concat(hookNames, 'default').sort()
    );
  });
});
