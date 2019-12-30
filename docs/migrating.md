# Migrating

Version 5.0.0 of `feathers-hooks-common` is compatible with Feathers v4 and up.

## Deprecations

The following hooks and utilities have been deprecated and replaced with Feathers v4 or Lodash functionality:

### Hooks

- `callback-to-promise` - Use `async/await`, native Promises or NodeJS [utils.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)
- `client` - Use [paramsFromClient]() instead
- `disable` - Use [disallow]() instead
- `disable-multi-item-change` - Use the database adapter `multi` option instead. See Feathers [https://docs.feathersjs.com/guides/migrating.html#multi-updates](https://docs.feathersjs.com/guides/migrating.html)
- disable-multi-item-create - Use the database adapter `multi` option instead. See Feathers [https://docs.feathersjs.com/guides/migrating.html#multi-updates](https://docs.feathersjs.com/guides/migrating.html)
- `pluck` - Use `iff(isProvider('external'), keep(...fieldNames))` instead
- `pluckQuery` - Use [keepQuery]() instead
- promiseToCallback - No longer necessary since callbacks have been deprecated in Feathers v3 and later
- `removeQuery` - Use [discardQuery]() instead
- `setCreatedAt` - Use [setNow]() instead
- `setUpdatedAt` - Use [setNow]() instead 
- `skipRemainingHooks` - Use conditional hook chains with [iff]() instead
- `skipRemainingHooksOnFlag` - Use conditional hook chains with [iff]() instead
- `softDelete2` - Use Feathers v4 database adapters and the new [softDelete]() instead

### Utilities

Several utility methods have been replaced by [Lodash]() methods which are thoroughly tested and performance optimized in many different environments.

- `existsByDot` - Use [_.has()]()
- `deleteByDot` - Use [_.omit]()
- `getByDot` - Use [_.get()]()
- `setByDot` - Use [_.set()]()

## Safe mutations

Most hooks have been updated to safely delete or add properties by replacing the object on the context with a new object instead of mutating it. This should prevent difficult to debug situations where e.g. `params` or `params.query` get changes in nested hooks when passed along.

## stashBefore

## softDelete

## setField
