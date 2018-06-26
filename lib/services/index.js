
const _conditionals = require('../common/_conditionals');
const { actOnDefault, actOnDispatch } = require('./act-on-dispatch');
const alterItems = require('./alter-items');
const cache = require('./cache');
const callbackToPromise = require('./callback-to-promise');
const { callingParamsDefaults, callingParams, makeCallingParams } = require('./calling-params');
const checkContext = require('./check-context');
const checkContextIf = require('./check-context-if');
const client = require('./client');
const combine = require('./combine');
const debug = require('./debug');
const deleteByDot = require('../common/delete-by-dot');
const dePopulate = require('./de-populate');
const disable = require('./disable');
const disableMultiItemChange = require('./disable-multi-item-change');
const disableMultiItemCreate = require('./disable-multi-item-create');
const disablePagination = require('./disable-pagination');
const disallow = require('./disallow');
const discard = require('./discard');
const discardQuery = require('./discard-query');
const existsByDot = require('../common/exists-by-dot');
const fastJoin = require('./fast-join');
const getByDot = require('../common/get-by-dot');
const getItems = require('./get-items');
const isProvider = require('./is-provider');
const keep = require('./keep');
const keepQuery = require('./keep-query');
const lowerCase = require('./lower-case');
const mongoKeys = require('./mongo-keys');
const paramsForServer = require('./params-for-server');
const paramsFromClient = require('./params-from-client');
const populate = require('./populate');
const pluck = require('./pluck');
const pluckQuery = require('./pluck-query');
const preventChanges = require('./prevent-changes');
const promiseToCallback = require('./promise-to-callback');
const removeQuery = require('./remove-query');
const replaceItems = require('./replace-items');
const required = require('./required');
const runHook = require('./run-hook');
const runParallel = require('./run-parallel');
const serialize = require('./serialize');
const setByDot = require('../common/set-by-dot');
const setCreatedAt = require('./set-created-at');
const setNow = require('./set-now');
const setSlug = require('./set-slug');
const setUpdatedAt = require('./set-updated-at');
const sifter = require('./sifter');
const skipRemainingHooks = require('./skip-remaining-hooks');
const softDelete = require('./soft-delete');
const stashBefore = require('./stash-before');
const traverse = require('./traverse');
const validate = require('./validate');
const validateSchema = require('./validate-schema');

const conditionals = _conditionals(
  function (hookFnArgs, serviceHooks) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

module.exports = Object.assign({ callbackToPromise,
  actOnDefault,
  actOnDispatch,
  alterItems,
  cache,
  callingParams,
  callingParamsDefaults,
  checkContext,
  checkContextIf,
  client,
  combine,
  debug,
  deleteByDot,
  dePopulate,
  disable,
  disableMultiItemChange,
  disableMultiItemCreate,
  disablePagination,
  disallow,
  discard,
  discardQuery,
  existsByDot,
  fastJoin,
  getByDot,
  getItems,
  isProvider,
  keep,
  keepQuery,
  lowerCase,
  makeCallingParams,
  mongoKeys,
  paramsForServer,
  paramsFromClient,
  populate,
  pluck,
  pluckQuery,
  preventChanges,
  promiseToCallback,
  removeQuery,
  replaceItems,
  required,
  runHook,
  runParallel,
  serialize,
  setByDot,
  setCreatedAt,
  setNow,
  setSlug,
  setUpdatedAt,
  sifter,
  skipRemainingHooks,
  softDelete,
  stashBefore,
  traverse,
  validate,
  validateSchema
}, conditionals);
