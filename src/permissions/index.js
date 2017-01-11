
import combine from './combine';
import _conditionals from '../common/_conditionals';

const conditionals = _conditionals(
  function (hookFnArgs, permissionsHooks) {
    return permissionsHooks ? combine(...permissionsHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine },
  conditionals,
);
