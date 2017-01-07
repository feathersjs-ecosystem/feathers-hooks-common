
import combine from './combine';
import Conditionals from '../common/conditionals-split';

const conditionals = new Conditionals(
  function (hookFnArgs, permissionsHooks) {
    return permissionsHooks ? combine(...permissionsHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine },
  conditionals,
);
