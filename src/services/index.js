
import _conditionals from '../common/_conditionals';
import callbackToPromise from './callback-to-promise';
import checkContext from './check-context';
import checkContextIf from './check-context-if';
import client from './client';
import combine from './combine';
import debug from './debug';
import deleteByDot from '../common/delete-by-dot';
import dePopulate from './de-populate';
import disable from './disable';
import disableMultiItemChange from './disable-multi-item-change';
import getByDot from '../common/get-by-dot';
import getItems from './get-items';
import isProvider from './is-provider';
import legacyPopulate from './legacy-populate';
import lowerCase from './lower-case';
import populate from './populate';
import pluck from './pluck';
import pluckQuery from './pluck-query';
import promiseToCallback from './promise-to-callback';
import remove from './remove';
import removeQuery from './remove-query';
import replaceItems from './replace-items';
import serialize from './serialize';
import setByDot from '../common/set-by-dot';
import setCreatedAt from './set-created-at';
import setSlug from './set-slug';
import setUpdatedAt from './set-updated-at';
import softDelete from './soft-delete';
import traverse from './traverse';
import validate from './validate';
import validateSchema from './validate-schema';

const conditionals = _conditionals(
  function (hookFnArgs, serviceHooks) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { callbackToPromise,
      checkContext,
      checkContextIf,
      client,
      combine,
      debug,
      deleteByDot,
      dePopulate,
      disable,
      disableMultiItemChange,
      getByDot,
      getItems,
      isProvider,
      legacyPopulate,
      lowerCase,
      populate,
      pluck,
      pluckQuery,
      promiseToCallback,
      remove,
      removeQuery,
      replaceItems,
      serialize,
      setByDot,
      setCreatedAt,
      setSlug,
      setUpdatedAt,
      softDelete,
      traverse,
      validate,
      validateSchema
  },
  conditionals,
);
