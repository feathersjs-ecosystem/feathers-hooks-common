
import { assert } from 'chai';
import * as allExported from '../src';

const members = [
  'actOnDefault',
  'actOnDispatch',
  'alterItems',
  'cache',
  'callingParams',
  'callingParamsDefaults',
  'capitalize',
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
  'setField',
  'setNow',
  'setSlug',
  'sifter',
  'softDelete',
  'stashBefore',
  'traverse',
  'trim',
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
      Object.keys(allExported).sort(),
      [].concat(members).sort()
    );
  });
});
