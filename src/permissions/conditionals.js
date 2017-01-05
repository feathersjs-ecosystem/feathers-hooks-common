
import Conditionals from '../common/conditionals';

// 'combine' is like 'every', each permission func must return true
const combine = (...permissionHooks) => function (hook) {
  const hooks = permissionHooks.map(hookFn => hookFn.call(this, hook));

  return Promise.all(hooks).then(results => {
    return Promise.resolve(results.every(result => !!result));
  });
};

const conditionals = new Conditionals(
  function (hookFnArgs, permissionsHooks) {
    return permissionsHooks ? combine(...permissionsHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

export default Object.assign(
  { combine },
  conditionals,
);
