
const _conditionals = require('../common/_conditionals');
const { actOnDefault, actOnDispatch } = require('./act-on-dispatch');
const alterItems = require('./alter-items');
const cache = require('./cache');
const { callingParamsDefaults, callingParams, makeCallingParams } = require('./calling-params');
const checkContext = require('./check-context');
const checkContextIf = require('./check-context-if');
const combine = require('./combine');
const debug = require('./debug');
const deleteByDot = require('../common/delete-by-dot');
const dePopulate = require('./de-populate');
const disablePagination = require('./disable-pagination');
const disallow = require('./disallow');
const discard = require('./discard');
const discardQuery = require('./discard-query');
const existsByDot = require('../common/exists-by-dot');
const fastJoin = require('./fast-join');
const fgraphql = require('./fgraphql');
const getByDot = require('../common/get-by-dot');
const getItems = require('./get-items');
const isProvider = require('./is-provider');
const keep = require('./keep');
const keepInArray = require('./keep-in-array');
const keepQuery = require('./keep-query');
const keepQueryInArray = require('./keep-query-in-array');
const lowerCase = require('./lower-case');
const mongoKeys = require('./mongo-keys');
const paramsForServer = require('./params-for-server');
const paramsFromClient = require('./params-from-client');
const populate = require('./populate');
const preventChanges = require('./prevent-changes');
const replaceItems = require('./replace-items');
const required = require('./required');
const runHook = require('./run-hook');
const runParallel = require('./run-parallel');
const sequelizeConvert = require('./sequelize-convert');
const serialize = require('./serialize');
const setByDot = require('../common/set-by-dot');
const setNow = require('./set-now');
const setSlug = require('./set-slug');
const sifter = require('./sifter');
const softDelete = require('./soft-delete');
const stashBefore = require('./stash-before');
const traverse = require('./traverse');
const validate = require('./validate');
const validateSchema = require('./validate-schema');

const conditionals = _conditionals(
  function (hookFnArgs, serviceHooks) {
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
  deleteByDot,
  dePopulate,
  disablePagination,
  disallow,
  discard,
  discardQuery,
  existsByDot,
  fastJoin,
  fgraphql,
  getByDot,
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
  setByDot,
  setNow,
  setSlug,
  sifter,
  softDelete,
  stashBefore,
  traverse,
  validate,
  validateSchema
}, conditionals);
