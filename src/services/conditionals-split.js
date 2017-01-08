
import combine from './combine';
import Conditionals from '../common/conditionals-split';
import isProvider from './is-provider';

const conditionals = Conditionals(
  function (hookFnArgs, serviceHooks) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine, isProvider },
  conditionals,
);
