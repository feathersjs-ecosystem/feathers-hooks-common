# Migrating

Version 5.0.0 of `feathers-hooks-common` is compatible with Feathers v4 and up.

## Deprecations

The following hooks and utilities have been deprecated and replaced with different named alternatives, Feathers v4 or Lodash functionality:

### Hooks

- `callback-to-promise` - Use `async/await`, native Promises or NodeJS [utils.promisify](https://nodejs.org/api/util.html#util_util_promisify_original)
- `client` - Use [paramsFromClient](../hooks.md#paramsFromClient) instead
- `disable` - Use [disallow](../hooks.md#disallow) instead
- `disable-multi-item-change` - Use the database adapter `multi` option instead. See the [Feathers v4 migration guide](https://docs.feathersjs.com/guides/migrating.html) for more information.
- disable-multi-item-create - Use the database adapter `multi` option instead. See the [Feathers v4 migration guide](https://docs.feathersjs.com/guides/migrating.html) for more information.
- `pluck` - Use `iff(isProvider('external'), keep(...fieldNames))` instead
- `pluckQuery` - Use [keepQuery](../hooks.md#keepquery) instead
- promiseToCallback - No longer necessary since callbacks have been deprecated in Feathers v3 and later
- `removeQuery` - Use [discardQuery](../hooks.md#discardquery) instead
- `setCreatedAt` - Use [setNow](../hooks.md#setnow) instead
- `setUpdatedAt` - Use [setNow](../hooks.md#setnow) instead 
- `skipRemainingHooks` - Use conditional hook chains with [iff](../hooks.md#iff) instead
- `skipRemainingHooksOnFlag` - Use conditional hook chains with [iff](../hooks.md#iff) instead
- `softDelete2` - Use Feathers v4 database adapters and the new [softDelete](../hooks.md#softdelete) instead

### Utilities

Several utility methods have been replaced by [Lodash](https://lodash.com) methods which are thoroughly tested and performance optimized in many different environments.

- `existsByDot` - Use [_.has()](https://lodash.com/docs/latest#has)
- `deleteByDot` - Use [_.omit](https://lodash.com/docs/latest#omit)
- `getByDot` - Use [_.get()](https://lodash.com/docs/latest#get)
- `setByDot` - Use [_.set()](https://lodash.com/docs/latest#set)

## Safe mutations

Most hooks have been updated to safely delete or add properties by replacing the object on the context with a new object instead of mutating it. This should prevent difficult to debug situations where e.g. `params` or `params.query` get changes in nested hooks when passed along.

## stashBefore

## softDelete

## setField
