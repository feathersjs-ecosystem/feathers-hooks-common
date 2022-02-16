
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hooks'.
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
  'dePopulate',
  'disablePagination',
  'disallow',
  'discard',
  'discardQuery',
  'fastJoin',
  'fgraphql',
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

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services exposed hooks', () => {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('expected hooks are exposed', () => {

  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('no unexpected hooks', () => {
    assert.deepEqual(
      Object.keys(hooks).sort(),
      // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
      [].concat(hookNames, 'default').sort()
    );
  });
});
