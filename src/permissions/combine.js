
// 'combine' is like 'every', each permission func must return true
export default function (...permissionHooks) {
  return function (hook) {
    const hooks = permissionHooks.map(hookFn => hookFn.call(this, hook));

    return Promise.all(hooks)
      .then(results => Promise.resolve(results.every(result => !!result))
      );
  };
}
