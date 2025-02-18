## feathers-hooks-common

#### hooks

- added alterData, alterResult, deprecated alterItems
- added discardData, discardResult, deprecated discard
  - moved to omitData, omitResult, deprecated omit
- added keepData, keepResult, deprecated keep
  - moved to pickData, pickResult, deprecated pick
- added lowercaseData, lowercaseResult, deprecated lowercase
- added setNowData, setNowResult, deprecated setNow

- removed several checks that are handled by typescript
- removed check for `preventChanges(true, ...fieldNames)`

- renamed 'keepQuery' to 'pickQuery', added alias
- renamed 'required' to 'checkRequired', added alias

- added throwIf
- added throwIfIsProvider
- added throwIfIsMulti
- added paramsForServer2 & paramsForClient2

- added 'onDelete' & 'createRelated'

- rm support for spread argument

#### predicates

- renamed 'isNot' to 'not' (added alias for 'isNot')
- added predicate isMulti
- added predicate isPaginated
- added predicate isContext

#### utils

- added getDataIsArray, getResultIsArray, deprecated getItems
- added replaceData, replaceResult, deprecated replaceItems
- added util getPaginate
- added util setResultEmpty

- add onDelete

- stashBefore multi

- new: createRelated
- new: onDelete

- softDelete: added 'transformParams' & added 'key' option

### Hooks to discuss

- cache
- populate
- dePopulate
- fgraphql
- fastJoin
- sequelizeConvert
- serialize

<p align="center">
  <img src="https://hooks-common.feathersjs.com/feathers-hooks-common-logo.png" width="200">
</p>

[![npm](https://img.shields.io/npm/v/feathers-hooks-common)](https://www.npmjs.com/package/feathers-hooks-common)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/feathersjs-ecosystem/feathers-hooks-common/CI/master)](https://github.com/feathersjs-ecosystem/feathers-hooks-common/actions/workflows/nodejs.yml?query=branch%3Amaster)
[![libraries.io](https://img.shields.io/librariesio/release/npm/feathers-hooks-common)](https://libraries.io/npm/feathers-hooks-common)
[![npm](https://img.shields.io/npm/dm/feathers-hooks-common)](https://www.npmjs.com/package/feathers-hooks-common)
[![GitHub license](https://img.shields.io/github/license/feathersjs-ecosystem/feathers-hooks-common)](https://github.com/feathersjs-ecosystem/feathers-hooks-common/blob/master/LICENSE)
[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/qa8kez8QBx)

A collection of useful hooks to use with Feathers services.

> NOTE: This is the version for Feathers v5. For Feathers v4 use [feathers-hooks-common v6](https://github.com/feathersjs-ecosystem/feathers-hooks-common/tree/crow)

```
npm install feathers-hooks-common --save
```

## Documentation

For the full list and API of available hooks and utilities, refer to the [feathers-hooks-common documentation](https://hooks-common.feathersjs.com/overview.html).

## Tests

`npm test` to run tests.

## License

See [LICENSE](LICENSE).
