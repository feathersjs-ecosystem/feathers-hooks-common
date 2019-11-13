
const { assert } = require('chai');
const hooks = require('../../lib/index');

const hookNames = [
  'actOnDefault',
  'actOnDispatch',
  'alterItems',
  'cache',
  'callingParams',
  'callingParamsDefaults',
  'checkContext',
  'checkContextIf',
  'combine',
  'debug',
  'deleteByDot',
  'dePopulate',
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
  'preventChanges',
  'replaceItems',
  'required',
  'runHook',
  'runParallel',
  'sequelizeConvert',
  'serialize',
  'setByDot',
  'setNow',
  'setSlug',
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
