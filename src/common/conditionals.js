
import feathersErrors from 'feathers-errors';
import Conditionals from '../common/conditionals-split';
import { processHooks } from 'feathers-hooks/lib/commons';

const errors = feathersErrors.errors;

const combine = (...serviceHooks) => {
  return function (hook) {
    return processHooks.call(this, serviceHooks, hook);
  };
};

const isProvider = (...providers) => {
  if (!providers.length) {
    throw new errors.MethodNotAllowed('Calling iff() predicate incorrectly. (isProvider)');
  }

  return hook => {
    const hookProvider = (hook.params || {}).provider;

    return providers.some(provider => provider === hookProvider ||
      (provider === 'server' && !hookProvider) ||
      (provider === 'external' && hookProvider)
    );
  };
};

const conditionals = Conditionals(
  function (hookFnArgs, serviceHooks) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine, isProvider },
  conditionals,
);
