
const _conditionals = require('../common/_conditionals');
const { actOnDefault, actOnDispatch } = require('./act-on-dispatch');
const alterItems = require('./alter-items');
const cache = require('./cache');
const { callingParamsDefaults, callingParams, makeCallingParams } = require('./calling-params');
const checkContext = require('./check-context');
const checkContextIf = require('./check-context-if');
const combine = require('./combine');
const debug = require('./debug');
const dePopulate = require('./de-populate');
const disablePagination = require('./disable-pagination');
const discard = require('./discard');
const disallow = require('./disallow');
const discardQuery = require('./discard-query');
const fastJoin = require('./fast-join');
const fgraphql = require('./fgraphql');
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
