# Notable changes to feathers-hooks-common 

## 1.6.0
- Added setCbVarNames, fnPromisify, fnPromisifyCallback, fnPromisifySync, promisifyHook
in feathers-hooks-common/promisify.
- Added validate. Deprecated validateSync, validateUsingCallback, validateUsingPromise.
- Added tests for everything added.
- Deprecated restrictToRoles as the new feathers-authenticate will have this feature and more.
- Deprecated the internal predicate function in many of the bundled hooks.

## 1.5.7
- `isNot` added.

## 1.5.4
- `iff` conditional hook added.
- `isProvider` predicate added for use with `iff`.

## 1.5.0
- softDelete (ALPHA) mark items as deleted rather than deleting them from the database.
- feathers-hooks-common/utils exposed as utils for writing hooks.
Dependencies on outside hook utility packages removed.

## 1.4.0
- Hooks from eddyystop/feathers-hooks-common brought up to bundled hook standards.
**_Breaking changes._**

## 1.3.0
- Merged feathers bundled hooks and eddyystop/feathers-hooks-common into
feathersjs/feathers-hooks-common and npm's feathers-hooks-common.
- Bundled hooks support dot field notation.
- Test suite.
