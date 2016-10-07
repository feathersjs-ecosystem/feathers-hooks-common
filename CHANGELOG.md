# Notable changes to feathers-hooks-common

We are not automatically dumping git logs into CHANGELOG.
The purpose of a CHANGELOG is to make it easier for users and contributors to see
precisely what *notable* changes have been made between each release (or version) of the project.
Dumping all the commit logs into a single file doesn't do this.

## 1.7.2
- Added a modified validate hook. 
The need for a validate hook and a cleaner signature for it became
apparent while modify the hooks section of feathers-docs.

## 1.7.0
- Deprecated all validate*, removed from README.
Its frankly easier for the dev to inline the validation than to
use these validation routines: less cognitive load, no awkward
interface, easier to reason about.
- Remove try/catch in promisify*.
There is no need to do a try/catch when you are within a new Promise()
as that itself will catch any throws.
Placed note in CHANGELOG that it should be curated and just contain
git log.

## 1.6.2
- fnPromisifyCallback properly rejects if it throws. Test added.

## 1.6.1
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

