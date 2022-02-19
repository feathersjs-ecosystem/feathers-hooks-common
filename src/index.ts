export { combine } from './services/combine'
export { actOnDefault, actOnDispatch } from './services/act-on-dispatch';
export { alterItems } from './services/alter-items';
export { cache } from './services/cache';
export { callingParamsDefaults, callingParams, makeCallingParams } from './services/calling-params';
export { checkContext } from './services/check-context';
export { checkContextIf } from './services/check-context-if';
export { debug } from './services/debug';
export { dePopulate } from './services/de-populate';
export { disablePagination } from './services/disable-pagination';
export { discard } from './services/discard';
export { disallow } from './services/disallow';
export { discardQuery } from './services/discard-query';
export { fastJoin } from './services/fast-join';
export { fgraphql } from './services/fgraphql';
export { getItems } from './services/get-items';
export { isProvider } from './services/is-provider';
export { keep } from './services/keep';
export { keepInArray } from './services/keep-in-array';
export { keepQuery } from './services/keep-query';
export { keepQueryInArray } from './services/keep-query-in-array';
export { lowerCase } from './services/lower-case';
export { mongoKeys } from './services/mongo-keys';
export { paramsForServer } from './services/params-for-server';
export { paramsFromClient } from './services/params-from-client';
export { populate } from './services/populate';
export { preventChanges } from './services/prevent-changes';
export { replaceItems } from './services/replace-items';
export { required } from './services/required';
export { runHook } from './services/run-hook';
export { runParallel } from './services/run-parallel';
export { sequelizeConvert } from './services/sequelize-convert';
export { serialize } from './services/serialize';
export { setNow } from './services/set-now';
export { setSlug } from './services/set-slug';
export { sifter } from './services/sifter';
export { softDelete } from './services/soft-delete';
export { stashBefore } from './services/stash-before';
export { traverse } from './services/traverse';
export { validate } from './services/validate';
export { validateSchema } from './services/validate-schema';

import { iff } from './common/iff';
export { iffElse } from './common/iff-else'
export { every } from './common/every';
export { isNot } from './common/is-not'
export { some } from './common/some'
export { unless } from './common/unless'

export {
  iff
}

/**
 * Alias for iff
 * Execute one or another series of hooks depending on a sync or async predicate.
 */
export const when = iff
