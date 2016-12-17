
import Conditionals from '../common/conditionals';
import { processHooks } from 'feathers-hooks/lib/commons';

const combine = (...serviceHooks) => {
  return function (hook) {
    return processHooks.call(this, serviceHooks, hook);
  };
};

const conditionals = new Conditionals(
  function (hookFnArgs, serviceHooks) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine },
  conditionals,
);
