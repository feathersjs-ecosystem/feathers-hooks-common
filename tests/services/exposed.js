
const { assert } = require('chai');
const hooks = require('../../lib/index');

const hookNames = [
  'alterItems',
  'cache',
  'callbackToPromise',
  'checkContext',
  'checkContextIf',
  'client',
  'combine',
  'debug',
  'deleteByDot',
  'dePopulate',
  'disable',
  'disableMultiItemChange',
  'disablePagination',
  'disallow',
  'discard',
  'discardQuery',
  'existsByDot',
  'fastJoin',
  'getByDot',
  'getItems',
  'isProvider',
  'keep',
  'keepQuery',
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
  'required',
  'runHook',
  'runParallel',
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
