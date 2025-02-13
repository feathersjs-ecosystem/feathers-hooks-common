import { assert } from 'vitest';
import * as allExported from '../src';

const members = [
  'actOnDefault',
  'actOnDispatch',

  // alter
  'alterItems',
  'alterData',
  'alterResult',

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

  // omit
  'discard',
  'discardData',
  'discardResult',
  'discardQuery',
  'omit',
  'omitData',
  'omitResult',
  'omitQuery',

  'fastJoin',
  'fgraphql',
  'getItems',
  'getDataIsArray',
  'getResultIsArray',
  'hookTypes',
  'isProvider',

  // pick
  'keep',
  'keepData',
  'keepResult',
  'keepQuery',
  'pick',
  'pickData',
  'pickResult',
  'pickQuery',

  'keepInArray',

  'keepQueryInArray',

  // lowercase
  'lowerCase',
  'lowercase',
  'lowercaseData',
  'lowercaseResult',

  'makeCallingParams',
  'methodNames',
  'mongoKeys',
  'paramsForServer',
  'paramsFromClient',
  'populate',
  'preventChanges',

  // replace
  'replaceItems',
  'replaceData',
  'replaceResult',

  'required',
  'runHook',
  'runParallel',
  'sequelizeConvert',
  'serialize',
  'setField',

  'setNow',
  'setNowData',
  'setNowResult',

  'setSlug',
  'sifter',
  'softDelete',
  'stashBefore',
  'traverse',
  'validate',
  'validateSchema',

  // iff
  'iffElse',
  'iff',
  'when',
  'unless',
  'some',
  'every',
  'isNot',

  'getPaginate',
  'isMulti',
  'isPaginated',
  'allowsMulti',
  'skipResult',
].sort();

describe('services exposed hooks', () => {
  it('no unexpected hooks', () => {
    assert.deepEqual(Object.keys(allExported).sort(), [...members].sort());
  });
});
