
const { assert } = require('chai');
const hooks = require('../../lib/index');

const hookNames = [
  'actOnDefault',
  'actOnDispatch',
  'alterItems',
  'cache',
  'callingParams',
  'callingParamsDefaults',
  'callbackToPromise',
  'checkContext',
  'checkContextIf',
  'client',
  'combine',
  'debug',
  'deleteByDot',
  'dePopulate',
  'dialablePhoneNumber',
  'disable',
  'disableMultiItemChange',
  'disableMultiItemCreate',
  'disablePagination',
  'disallow',
  'discard',
  'discardQuery',
  'existsByDot',
  'fastJoin',
  'fgraphql',
  'getByDot',
  'getItems',
  'isProvider',
  'keep',
  'keepInArray',
  'keepQuery',
  'keepQueryInArray',
  'lowerCase',
  'makeCallingParams',
  'mongoKeys',
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
  'sequelizeConvert',
  'serialize',
  'setByDot',
  'setCreatedAt',
  'setNow',
  'setSlug',
  'setUpdatedAt',
  'sifter',
  'skipRemainingHooks',
  'skipRemainingHooksOnFlag',
  'softDelete',
  'softDelete2',
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
