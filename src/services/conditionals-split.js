
import combine from './combine';
import _conditionals from '../common/_conditionals';
import isProvider from './is-provider';

const conditionals = _conditionals(
  function (hookFnArgs, serviceHooks) {
    return serviceHooks ? combine(...serviceHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine, isProvider },
  conditionals,
);
