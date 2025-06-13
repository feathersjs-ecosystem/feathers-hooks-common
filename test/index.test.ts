import { assert } from 'vitest'
import * as allExported from '../src/index.js'

const members = [
  // transform
  'transformData',
  'transformResult',

  'cache',
  'callingParams',
  'callingParamsDefaults',
  'checkContext',
  'checkContextIf',
  'combine',
  'createRelated',
  'debug',
  'disablePagination',
  'disallow',

  // omit
  'omitData',
  'omitResult',
  'omitQuery',

  'getItems',
  'getDataIsArray',
  'getResultIsArray',
  'hookTypes',
  'isProvider',

  // pick
  'pickData',
  'pickResult',
  'pickQuery',

  // lowercase
  'lowercaseData',
  'lowercaseResult',

  'makeCallingParams',
  'methodNames',
  'paramsForServer',
  'paramsFromClient',
  'preventChanges',

  // replace
  'replaceItems',
  'replaceData',
  'replaceResult',

  'checkRequired',
  'runParallel',
  'setField',

  'setNowData',
  'setNowResult',

  'setSlug',
  'softDelete',
  'stashBefore',
  'traverse',

  // iff
  'iffElse',
  'iff',
  'when',
  'unless',

  // predicates
  'some',
  'every',
  'not',
  'isMulti',
  'isPaginated',
  'isContext',

  'getPaginate',
  'skipResult',

  'trimData',
  'trimResult',

  'throwIf',
  'throwIfIsMulti',
  'throwIfIsProvider',

  'getExposedMethods',
  'transformParams',
].sort()

describe('services exposed hooks', () => {
  it('no unexpected hooks', () => {
    assert.deepEqual(Object.keys(allExported).sort(), [...members].sort())
  })
})
