## feathers-hooks-common

Useful hooks for use with Feathersjs services.

[![Build Status](https://travis-ci.org/feathersjs/feathers-hooks-common.svg?branch=master)](https://travis-ci.org/eddyystop/feathers-hooks-common)
[![Coverage Status](https://coveralls.io/repos/github/feathersjs/feathers-hooks-common/badge.svg?branch=master)](https://coveralls.io/github/feathersjs/feathers-hooks-common?branch=master)

## Code Examples

- [Data Items](#dataItems)
- [Query Params](#queryParams)
- [Validation](#validation)
- [Authorization](#authorization)
- [Database](#database)
- [Utilities](#utilities)
- [Conditional hooks](#conditionalHooks)
- [Utilities for Writing Hooks](#hookUtils)

## <a name="dataItems"></a> Data Items

(1) Join a related item to result (after hook).

- Supports multiple result items, including paginated `find`.
- Supports key field with an array of keys.
- Supports multiple joins.

```javascript
const hooks = require('feathers-hooks-common');
module.exports.after = {
  // add prop 'user' containing the user item who's key is in 'senderId'.
  all: [ hooks.populate('user', { field: 'senderId', service: '/users' }) ]
};
```

(2) Remove fields from data.

- Field names support dot notation e.g. 'name.address.city'
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.after = {
  all: [ hooks.remove('verifyToken', 'verifyExpires', (hook) => true) ]
};
```

(3) Retain only selected fields in data.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.after = {
  all: [ hooks.pluck('employee.name', 'employee.email',
           (hook) => new Promise(resolve => setTimeout(() => resolve(true), 100)) ]
};
```

(4) Convert fields to lower case.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.after = {
  all: [ hooks.lowerCase('email') ]
};
```

(5) Add created at timestamp.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  create: [ hooks.setCreatedAt('createdAt') ]
};
```

(6) Add or update the updated at timestamp.

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  create: [ hooks.setUpdatedAt('updatedAt') ]
};
```

## <a name="queryParams"></a> Query Params

(1) Remove criteria from query (before hook).

- Field names support dot notation
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  all: [ hooks.removeQuery('sex') ]
};
```

(2) Retain only selected criteria in query (before hook).

- Field names support dot notation.
- Supports multiple data items, including paginated `find`.
- May be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  all: [ hooks.pluckQuery('employee.dept') ]
};
```

## <a name="validation"></a> Validation

Fidelity and code reuse are improved if the server can rerun validation code written
for the front-end.

(1) Invoke a validation routine (before; create, update, patch).

- Support is provided for sync, callback (both through fnPromisify)
and promise based validation routines.
- Optionally replace the data with sanitized values.

```javascript
import { fnPromisify } from 'feathers-hooks-common/promisify'; // turn any func into Promise

const usersClientValidation = (values) => values.email ? null : { email: 'Email is invalid' };

const usersClientAsync = (values) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      values.email.trim()
        ? resolve({ ...values, email: values.email.trim() })
        : reject(new errors.BadRequest({ email: 'Email is invalid' }));
    }, 100);
  })
);

const usersServerValidation = (values, param2, cb) => {
  setTimeout(() => {
    values.email.trim()
      ? cb(null, { ...values, email: values.email.trim() }) // sanitize data
      : cb({ email: 'Email is invalid' });
  }, 100);
};

module.exports.before = {
  create: [
    hooks.validate(fnPromisify(usersClientValidations)), // sync
    hooks.validate(fnPromisify(usersClientAsync)), // promise. fnPromisify() wrapper is optional.
    hooks.validate(fnPromisify(usersServerValidations, 'valueForparam2')) // callback
};
```

(2) DEPRECATED validateSync, validateUsingCallback, validateUsingPromise

#### Note:

Please read the details involved in [promisifying functions](#promisify). 

The structure of the data object should be checked before any validation is performed.
Several schema validation packages
[are available](http://docs.feathersjs.com/why/showcase.html#validation).

## <a name="authorization"></a> Authorization

(1) Disable hook

- Disable service completely, from all external providers, or from certain providers.
- Service be dynamically disabled, using either a sync or promise based function.

```javascript
module.exports.before = {
  patch: [ hooks.disable('socketio', 'rest') ],
  create: [ hooks.disable((hook) => new Promise(resolve => resolve(true) )) ]
};
```

(2) Authorize access by role.
Convenience wrapper for `feathers-authentication.hooks.restrictToRoles`.

DEPRECATED. Use hooks provided by feathers-authentication v2.

- Clean, clear and DRY.
    
```javascript
const authorizer = hooks.restrictToRoles(['inv', 'ship'], 'userAuthorizedRoles', false, 'userId');

module.exports.before = {
  all: [ authorizer() ]
  create: [ authorizer(['purch']) ]
};
```

(3) 

## <a name="database"></a> Database

(1) Mark items as deleted rather than removing them from the database. **(ALPHA)**

```javascript
export.before = {
  remove: [ softDelete() ], // update item flagging it as deleted
  find: [ softDelete() ] // ignore deleted items
};
```

## <a name="utilities"></a> Utilities

(1) Normalize the URL slug (before).

Copy the slug from raw HTTP requests, e.g. https://.../stores/:storeid/...
to where other providers typically store it. Dot notation is supported.

```javascript
module.exports.before = {
  create: [ hooks.setSlug('storeid') ]
};
```

(2) Display current info about the hook to console.

```javascript
module.exports.after = {
  create: [ hooks.debug('step 1') ]
};
//step 1
// type: before, method: create
// data: { name: 'Joe Doe' }
// query: { sex: 'm' }
// result: { assigned: true }
```

#### <a name="promisify"></a> Promisifying functions

Wrap functions so they return Promises.

(3) Wrap a feathers hook so it returns a Promise.

Feathers may someday deprecate hooks which call callbacks.
You can future-proof any callback hooks you have by wrapping them to return Promises now.
There is support for

- Sync functions. Promise is rejected if the function throws.
- Functions calling a callback. The call to the callback may be sync or async. Rejected on throw.
- Functions returning a Promise. Basically a no-op.

```javascript
import { promisifyHook } from 'feathers-hooks-common/promisify';

const delayedCreatedAt = () => (hook, next) => {
  setTimeout(() => {
    hook.data.createdAt = new Date();
    next(null, hook);
  }, 100);
};
const updatedAt = () => (hook) => {
  hook.data.updatedAt = new Date();
  return hook;
};
const updatedBy = (email = 'email') => (hook) => {
  hook.data.email = hook.users[email];
  return Promise.resolve(hook);
);

const wrappedDelayedCreatedAt = promisifyHook(delayedCreatedAt());
const wrappedUpdatedAt = promisifyHook(updatedAt());
const wrappedUpdatedBy = promisifyHook(updatedBy('userEmail'));

module.exports.before = {
  create: [wrappedDelayedCreatedAt, wrappedUpdatedAt, wrappedUpdatedBy], // each returns a Promise
};
```

(4) Wrap any function to return a Promise.

```javascript
import { fnPromisify } from 'feathers-hooks-common/promisify';

function syncCheck(value) {
  if (value !== 1) { throw new Error( ... ); }
  return value;
}

function cbCheck(value, cb) {
  cb(value === 1 ? null : new Error( ... ), value);
}

fnPromisify(syncCheck)(1).then( ... ).catch( ... );
fnPromisify(cbCheck)(1).then( ... ).catch( ... );
```

- Use fnPromisifyCallback or fnPromisifySync instead on the front-end (because minification).
- Watch out on the back-end that common names are used for the callback param
i.e. cb, callback, callback_, done, or next.
- Watch out on the back-end for the rare cases which cannot be correctly parsed.
These involve params who default values involve parenthesis or commas
e.g. function abc(a = () => {}, b = (x, y) => {}, c = 'x,y'.indexOf(','))
- You have no worries if you transpile with Babel on the back-end (but do not minify).

(5) Wrap a function calling a callback into one that returns a promise.

```javascript
import { fnPromisifyCallback } from 'feathers-hooks-common/promisify';

function tester(data, a, b, cb) {
  cb(data === 1 ? null : 'bad', data);
} 
const wrappedTester = fnPromisifyCallback(tester, 3);

wrappedTester(1, 2, 3); // tester(1, 2, 3, wrapperCb)
wrappedTester(1, 2); // tester(1, 2, undefined, wrapperCb)
wrappedTester(); // tester(undefined, undefined undefined, wrapperCb)
wrappedTester(1, 2, 3, 4, 5); // tester(1, 2, 3, wrapperCb)
```

You may specify the number of params in the function signature,
not including the callback param itself.
The wrapped function will always be called with that number,
preventing potential bugs.

The function signature is parsed to obtain the count if paramsCountBeforeCb is not provided.
Read fnPromisify for some ramifications.

(6) Wrap a sync function into one that returns a promise.
This can be used to wrap any function other than one calling a callback
as functions returning a Promise are not affected by this wrapper.

- Promise is rejected if the function throws.

```javascript
import { fnPromisifyCallback } from 'feathers-hooks-common/promisify';

function testSync(data, a, b) {
  if (data === 3) {
    throw new Error('throwing');
  }

  return data === 1 ? data : 'bad';
}

fnPromisifySync(testSync)(1, 0, 0);
```

(7) Add to or replace the variable names commonly used for callbacks.

```javascript
import { setCbVarNames } from 'feathers-hooks-common/promisify';

const testHodor = (a, b, c, hodor) => {};

setCbVarNames('holdar', false); // false adds to list, true replaces
```

## <a name="conditionalHooks"></a> Running hooks conditionally

There are times when you may want to run a hook conditionally,
perhaps depending on the provider, the user authorization,
if the user created the record, etc.

A custom service may be designed to always be called with the `create` method,
with a data value specifying the action the service is to perform.
Certain actions may require authentication or authorization,
while others do not.

(1) Conditionally run a hook (before, after).

Run a predicate function,
which returns either a boolean, or a Promise which evaluates to a boolean.
Run the hook if the result is truesy.

```javascript
// sync predicate and hook
const isNotAdmin = adminRole => hook => hook.params.user.roles.indexOf(adminRole || 'admin') === -1;
hooks.iff(isNotAdmin(), hooks.remove('securityKey'))
);
// async predicate and hook
hooks.iff(
  () => new Promise((resolve, catch) => { ... }),
  hooks.populate('user', { field: 'senderId', service: '/users' })
);
```

(2) isProvider: predicate to check which provider called the service method.

```javascript
import hooks, { iff, isProvider } from 'feathers-hooks-common';
iff(isProvider('external'), hooks.remove( ... )) // also external, socketio, rest, primus
```

(3) isNot: negates a sync or async predicate.

```javascript
import hooks, { iff, isNot, isProvider } from 'feathers-hooks-common';
iff(isNot(isProvider('server')), hooks.remove( ... )) // also external, socketio, rest, primus
```

## <a name="hookUtils"></a> Utilities for Writing Hooks

These utilities may be useful when you are writing your own hooks.
You can import them from `feathers-hooks-common/lib/utils`.

(1) Get and replace the items in the hook.

- Handles before and after types.
- Handles paginated and non-paginated results from find.

```javascript```
import { getItems, replaceItems } from 'feathers-hooks-common/lib/utils';
export.before = { create: [ (hook) => {
  ...
  const items = getItems(hook);
  Array.isArray(items) ? items[0].code = 'a' : items.code = 'a';
  replaceItems(hook, items);
  ...
}]};
```

(2) Throw if a hook is used wrongly.

```javascript
import { checkContext } from 'feathers-hooks-common/lib/utils';
function myHook(hook) {
  checkContext(hook, 'before', ['create', 'remove']);
  ...
}
export.after = { create: [ myHook ]}; // throws
```

(3) Support dot notation in field access.

- Optionally deletes properties in object.

```javascript
import { getByDot, setByDot } from 'feathers-hooks-common/lib/utils';
export.before = { create: [ (hook) => {
  ...
  const city = getByDot(hook.data, 'person.address.city');
  setByDot(hook, 'data.person.address.city', 'London');
  ...
}]};
```

## <a name="motivation"></a> Motivation

Feathers [services](http://docs.feathersjs.com/services/readme.html)
can be developed faster if the
[hooks](http://docs.feathersjs.com/hooks/readme.html)
you need are at hand.

This package provides some commonly needed hooks.

## <a name="installation"></a> Installation

Install [Nodejs](https://nodejs.org/en/).

Run `npm install feathers-hooks-common --save` in your project folder.

`/src` on GitHub contains the ES6 source. It will run on Node 6+ without transpiling.

## <a name="apiReference"></a> API Reference

Each file in `/src` fully documents its exports.

See also the [Featherjs docs](http://docs.feathersjs.com/hooks/bundled.html#built-in-hooks).

## <a name="tests"></a> Tests

`npm test` to run tests.

`npm run cover` to run tests plus coverage.

## <a name="contribution"></a> Contributing

[Contribute to this repo.](./CONTRIBUTING.md)

[Guide to ideomatic contributing.](https://github.com/jonschlinkert/idiomatic-contributing)

## <a name="changeLog"></a> Change Log

[List of notable changes.](./CHANGELOG.md)

## <a name="license"></a> License

MIT. See LICENSE.
