
/* eslint-env es6, node */
/* eslint  max-len: 0, new-cap: 0, no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

import authentication from 'feathers-authentication';
import errors from 'feathers-errors';

import { getItems, replaceItems, setByDot, checkContext } from './utils';

const authHooks = authentication.hooks;

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fields - Field names.
 *    One or more fields may be set to the date-time. Dot notation is supported.
 *    The default is createdAt if no fields names are included.
 * @returns {Function} hook function(hook).
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.setCreatedAt('madeAt', hook => hook.data.status === 1);
 * hooks.setCreatedAt(hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */
export const setCreatedAt = (... fields) => {
  const addFields = data => {
    for (const field of fields) {
      setByDot(data, field, new Date());
    }
  };

  const callback = typeof fields[fields.length - 1] === 'function' ?
    fields.pop() : () => true;

  if (!fields.length) {
    fields = ['createdAt'];
  }

  return function (hook) {
    const items = hook.type === 'before' ? hook.data : hook.result;

    const update = condition => {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(addFields);
        } else {
          addFields(items);
        }
      }
      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ?
      check.then(update) : update(check);
  };
};

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fields - Field names.
 *    One or more fields may be set to the date-time. Dot notation is supported.
 *    The default is updatedAt if no fields names are included.
 * @returns {Function} hook function(hook).
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.setCreatedAt('madeAt', hook => hook.data.status === 1);
 * hooks.setCreatedAt(hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */
export const setUpdatedAt = (... fields) => {
  const addFields = data => {
    for (const field of fields) {
      setByDot(data, field, new Date());
    }
  };

  const callback = typeof fields[fields.length - 1] === 'function' ?
    fields.pop() : () => true;

  if (!fields.length) {
    fields = ['updatedAt'];
  }

  return function (hook) {
    const items = hook.type === 'before' ? hook.data : hook.result;

    const update = condition => {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(addFields);
        } else {
          addFields(items);
        }
      }
      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ?
      check.then(update) : update(check);
  };
};

/**
 * Normalize slug, so it can be accessed in the same place regardless of provider and transport.
 *
 * @param {string} slug - The slug, e.g. 'storeId' for http://.../stores/:storeId/...
 * @param {?string} field - where in hook.params to copy the URL slug. Dot notation is supported.
 *    hook.params.query[storeId] is the default location.
 * @returns {Function} hook function(hook)
 *
 * A service may have a slug in its path e.g. app.use('/stores/:storeId/candies', new Service());
 * The service gets slightly different values depending on the transport used by the client.
 *
 * hook.params.
 * transport         storeId   hook.params.query                 code on client
 * ----------------- --------- --------------------------------- ------------------------
 * feathers-socketio undefined { size: 'large', storeId: '123' } candies.create({ name: 'Gummi', qty: 100 }, { query: { size: 'large', storeId: '123' } }, cb)
 * feathers-rest     :storeId  { size: 'large', storeId: '123' } ... same as above
 * raw HTTP          123       { size: 'large' }                 fetch('/stores/123/candies?size=large', ...
 *
 * This hook normalizes the difference between the transports. A hook of
 * all: [ hooks.setSlug('storeId') ]
 * provides a normalized hook.params.query of { size: 'large', storeId: '123' } for the above.
 *
 * module.exports.before = {
 *   all: [ hooks.setSlug('storeId') ]
 * };
 */
export const setSlug = (slug, field) => (hook) => {
  if (typeof field !== 'string') {
    field = `query.${slug}`;
  }

  if (hook.type === 'after') {
    throw new errors.GeneralError('Cannot set slug on after hook. (setSlug)');
  }

  if (hook.params && hook.params.provider === 'rest') {
    const value = hook.params[slug];
    if (typeof value === 'string' && value[0] !== ':') {
      setByDot(hook.params, field, value);
    }
  }
};

/**
 * Display debug info in hooks
 *
 * @param {string} msg - Message to display.
 * @returns {Function} hook function(hook)
 *
 * module.exports.before = {
 *   create: [ hooks.debug('step 1') ]
 * };
 */
export const debug = (msg) => (
  (hook) => {
    console.log(`* ${msg || ''}\ntype:${hook.type}, method: ${hook.method}`);
    if (hook.data) { console.log('data:', hook.data); }
    if (hook.params && hook.params.query) { console.log('query:', hook.params.query); }
    if (hook.result) { console.log('result:', hook.result); }
  }
);

/**
 * DEPRECATED: Factory for Feathers hooks.restrictToRoles.
 *
 * @param {?array|string} [defaultRoles=[]] - Roles authorized to continue. Default [].
 * @param {?string} rolesFieldName - Name of field containing roles. Default 'roles'.
 * @param {?boolean} defaultIfOwner - If record owner authorized to continue. Default false.
 * @param {?string} ownerFieldName - Name of field containing owner ID. Default 'ownerId'.
 * @returns {Function} hook function(hook, next)
 *
 * Example:
 * const authorizer = hooks.restrictToRoles([], 'allowedRoles', false, 'ownerId');
 * module.exports.before = {
 *   all: [ authorizer(['purchasing', 'accounting']) ]
 * }
 */
export const restrictToRoles =
  (defaultRoles, rolesFieldName = 'roles', defaultIfOwner = false, ownerFieldName = 'ownerId') => {
    console.error(
      'DEPRECATED Use feathers-authentication v0.8. Removed next ver. (restrictToRoles)'
    );
    if (!defaultRoles) { defaultRoles = []; }

    return (roles, ifOwner) => authHooks.restrictToRoles({
      roles: roles || defaultRoles,
      fieldName: rolesFieldName || 'roles',
      owner: typeof ifOwner === 'undefined' ? defaultIfOwner : ifOwner,
      ownerField: ownerFieldName || 'createdById',
    });
  };

/**
 * Call a validation routine which returns form errors.
 *
 * @param {Function} validator - with signature (formValues, ...rest)
 * @param {?Array.<*>} rest - Params #2+ for validator
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest)
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   returns:     { email: 'Email not found', password: 'Password is incorrect.' }
 */
export const validateSync = (validator, ...rest) => (hook) => {
  console.error('DEPRECATED Use validate. Removed next ver. (validateSync)');
  checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateSync');

  const formErrors = validator(getItems(hook), ...rest);

  if (formErrors && Object.keys(formErrors).length) {
    throw new errors.BadRequest({ errors: formErrors });
  }

  return hook;
};

/**
 * Call a validation routine which uses a callback.
 *
 * @param {Function} validator - with signature (formValues, ...rest, (err, newValues) => {...})
 * @param {?Array.<*>} rest - params #2+ for validator, not including the callback
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest, internal_callback)
 *   ...rest:     All params must be specified so the callback is defined in the proper place.
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   err:         { email: 'Email not found', password: 'Password is incorrect.' } or new Error(...)
 *   newValues:   Replaces formValues if truthy
 *
 * Note this is not compatible with Feathersjs callbacks from services. Use promises for these.
 */
export const validateUsingCallback = (validator, ...rest) => (hook, next) => {
  console.error('DEPRECATED Use validate. Removed next ver. (validateUsingCallback)');
  checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingCallback');
  const rest1 = rest.concat(cb);

  validator(getItems(hook), ...rest1);

  function cb(formErrors, convertedValues) {
    if (formErrors) {
      return next(formErrors instanceof Error ? formErrors :
        new errors.BadRequest('Invalid data', { errors: formErrors }), hook);
    }

    if (convertedValues) {
      replaceItems(hook, convertedValues);
    }

    return next(null, hook);
  }
};

/**
 * Call a validation routine which returns a Promise.
 *
 * @param {Function} validator - with signature (formValues, ...rest)
 * @param {?Array.<*>} rest - params #2+ for validator
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest)
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   reject:      reject(new errors.BadRequest({ errors: { email: 'Email not found' }}))
 *                Or reject(new errors.GeneralError(...))
 *   resolve:     resolve(data) replaces formValues if truthy
 */
export const validateUsingPromise = (validator, ...rest) => {
  console.error('DEPRECATED Use validate. Removed next ver. (validateUsingPromise)');

  return validate(validator, ...rest);
};

/**
 * Call a validation routine which returns a Promise.
 *
 * @param {Function} validator - with signature (formValues, ...rest)
 * @param {?Array.<*>} rest - params #2+ for validator
 * @returns {Function} hook function(hook, next)
 *
 * The validator is called with: validator(formValues, ...rest)
 *   formValues:  { email: 'a@a.com', password: '1234567890' }
 *   reject:      reject(new errors.BadRequest({ errors: { email: 'Email not found' }}))
 *                Or reject(new errors.GeneralError(...))
 *   resolve:     resolve(data) replaces formValues if truthy
 */
export const validate = (validator, ...rest) => (hook) => {
  checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingPromise');

  return validator(getItems(hook), ...rest)
    .then(convertedValues => {
      if (convertedValues) {
        replaceItems(hook, convertedValues);
      }

      return hook;
    });
};

/**
 * Before acting on a request, such as saving a new user record. the server should validate the
 * schema of the request object, rerun any validations the client has already performed,
 * and then perform any additional server-side validation.
 *
 * We would of course prefer to reuse the client-side validation code.
 *
 * The following would be typical validation for user create if we use
 * - the popular redux-form for handling react client forms
 * - joi for schema validation:
 *
 * // index.js
 * // support async checking for unique email addrs and usernames, among other things
 * const verifyResetService = require('feathers-service-verify-reset').service;
 * app.configure(verifyResetService(...)); // custom service
 *
 * // user/hooks/index.js
 * const hooks = require('feathers-hooks-common');
 * const validateSchema = require('feathers-hooks-validate-joi');
 * const verifyReset = app.service('/verifyReset/:action/:value');
 *
 * create: [
 *   validateSchema.form(schemas.signup, schemas.options), // schema validation
 *   hooks.validateSync(usersClientValidations.signup),  // redo redux-form client validation
 *   hooks.validateUsingPromise( // redo redux-form async validation, for uniqueness
 *     (values) => verifyReset.create( // wrap call for compatibility with validateUsingPromise
 *       { action: 'unique', value: { username: values.username, email: values.email } }
 *     )
 *   ),
 *   hooks.validateUsingCallback(usersServerValidations.signup, {}), // server validation
 *   hooks.remove('confirmPassword'),
 *   auth.hashPassword(),
 * ],
 *
 * See feathersjs-starter-react-redux-login for a working example.
 */
