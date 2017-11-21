
- write discardQuery, deprecate removeQuery
- write is-transport, deprecate is-provider

- cache
  - before: cacheClear(cache, keyFieldName) - default to context.service.id, or _id, id if that was falsey.
    - get - return cache entry if exists, else continue
    - find, create - no-op
    - update, patch, remove - remove id or _id from cache
  - after: cacheAdd(cache, keyFieldName)
    - all methods - **add each record to cache** with its id, _id.

- typescript
  module.exports = funcName;
  module.exports.default = funcName

*** eddyystop:
- merge the validate... hooks.
if the last param in the called fcn defn is provided and is a fcn, then assume cb.
else check if a promise is returned.
- ? memoization for hooks.populate
- ? unit test softDelete. Would first require very large changes to feathers-tests-app-user.
Else test on a 'live' db.
- https://github.com/MichaelErmer/feathers-populate-hook
- look at this. executes a series of hooks.
function runHooksUnless(checkerFn, hooks) {
  return (hook) => {
    const check = checkerFn(hook);

    if (check && typeof check.then === 'function') {
      return check.then(runUnless);
    } else {
      return runUnless(check);
    }

    function runUnless(shouldNotRun) {
      return shouldNotRun ? hook : runHooks();
    }

    function runHooks() {
      return Promise.mapSeries(hooks, (hookFn) => {
        return hookFn(hook);
      })
      .then(() => hook);
    }
  }
}