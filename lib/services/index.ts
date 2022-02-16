
const _conditionals = require('../common/_conditionals');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'actOnDefau... Remove this comment to see the full error message
const { actOnDefault, actOnDispatch } = require('./act-on-dispatch');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'alterItems... Remove this comment to see the full error message
const alterItems = require('./alter-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cache'.
const cache = require('./cache');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'callingPar... Remove this comment to see the full error message
const { callingParamsDefaults, callingParams, makeCallingParams } = require('./calling-params');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContextIf = require('./check-context-if');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'combine'.
const combine = require('./combine');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'debug'.
const debug = require('./debug');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'dePopulate... Remove this comment to see the full error message
const dePopulate = require('./de-populate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'disablePag... Remove this comment to see the full error message
const disablePagination = require('./disable-pagination');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'discard'.
const discard = require('./discard');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'disallow'.
const disallow = require('./disallow');
const discardQuery = require('./discard-query');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fastJoin'.
const fastJoin = require('./fast-join');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fgraphql'.
const fgraphql = require('./fgraphql');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'isProvider... Remove this comment to see the full error message
const isProvider = require('./is-provider');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'keep'.
const keep = require('./keep');
const keepInArray = require('./keep-in-array');
const keepQuery = require('./keep-query');
const keepQueryInArray = require('./keep-query-in-array');
const lowerCase = require('./lower-case');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'mongoKeys'... Remove this comment to see the full error message
const mongoKeys = require('./mongo-keys');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'paramsForS... Remove this comment to see the full error message
const paramsForServer = require('./params-for-server');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'paramsFrom... Remove this comment to see the full error message
const paramsFromClient = require('./params-from-client');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'populate'.
const populate = require('./populate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'preventCha... Remove this comment to see the full error message
const preventChanges = require('./prevent-changes');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'required'.
const required = require('./required');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'runHook'.
const runHook = require('./run-hook');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'runParalle... Remove this comment to see the full error message
const runParallel = require('./run-parallel');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sequelizeC... Remove this comment to see the full error message
const sequelizeConvert = require('./sequelize-convert');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'serialize'... Remove this comment to see the full error message
const serialize = require('./serialize');
const setNow = require('./set-now');
const setSlug = require('./set-slug');
const sifter = require('./sifter');
const softDelete = require('./soft-delete');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'stashBefor... Remove this comment to see the full error message
const stashBefore = require('./stash-before');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'traverse'.
const traverse = require('./traverse');
const validate = require('./validate');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'validateSc... Remove this comment to see the full error message
const validateSchema = require('./validate-schema');

const conditionals = _conditionals(
  function(this: any, hookFnArgs: any, serviceHooks: any) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

module.exports = Object.assign({
  actOnDefault,
  actOnDispatch,
  alterItems,
  cache,
  callingParams,
  callingParamsDefaults,
  checkContext,
  checkContextIf,
  combine,
  debug,
  dePopulate,
  disablePagination,
  disallow,
  discard,
  discardQuery,
  fastJoin,
  fgraphql,
  getItems,
  isProvider,
  keep,
  keepInArray,
  keepQuery,
  keepQueryInArray,
  lowerCase,
  makeCallingParams,
  mongoKeys,
  paramsForServer,
  paramsFromClient,
  populate,
  preventChanges,
  replaceItems,
  required,
  runHook,
  runParallel,
  sequelizeConvert,
  serialize,
  setNow,
  setSlug,
  sifter,
  softDelete,
  stashBefore,
  traverse,
  validate,
  validateSchema
}, conditionals);
