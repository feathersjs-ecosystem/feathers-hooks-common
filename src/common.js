
/* eslint-env es6, node */
/* eslint  max-len: 0, new-cap: 0, no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */
import errors from 'feathers-errors';

import { getItems, replaceItems, setByDot, checkContext } from './utils';

/**
 * Set one or more fields to a value. Base function for setCreateAt and setUpdatedAt.
 *
 * @param {string} defaultFieldName - default field name to add or update
 * @param {*} value - The value to set the fields to
 * @param {Array.<string|Function>} fieldNames - Field names.
 * @returns {Function} hook function(hook).
 */
const setField = (defaultFieldName, value, ...fieldNames) => {
  const addFields = data => {
    for (const field of fieldNames) {
      const fieldValue = typeof value === 'function' ? value() : value;

      setByDot(data, field, fieldValue);
    }
  };

  const callback = typeof fieldNames[fieldNames.length - 1] === 'function'
    ? fieldNames.pop() : () => true;

  if (!fieldNames.length) {
    fieldNames = [defaultFieldName];
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

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
};

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fieldNames - Field names.
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
export const setCreatedAt = (...fieldNames) => setField('createdAt', () => new Date(), ...fieldNames);

/**
 * Set the fields to the current date-time. The fields are either in the data submitted
 * (as a before hook for create, update or patch) or in the result (as an after hook).
 * If the data is an array or a paginated find result the hook will lowercase the field
 * for every item.
 *
 * @param {Array.<string|Function>} fieldNames - Field names.
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
export const setUpdatedAt = (...fieldNames) => setField('updatedAt', () => new Date(), ...fieldNames);

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
export const debug = (msg) =>
  (hook) => {
    console.log(`* ${msg || ''}\ntype:${hook.type}, method: ${hook.method}`);
    if (hook.data) { console.log('data:', hook.data); }
    if (hook.params && hook.params.query) { console.log('query:', hook.params.query); }
    if (hook.result) { console.log('result:', hook.result); }
  }
;

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
  console.error('DEPRECATED Removed next ver. (validateSync)');
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
  console.error('DEPRECATED Removed next ver. (validateUsingCallback)');
  checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingCallback');
  const rest1 = rest.concat(cb);

  validator(getItems(hook), ...rest1);

  function cb (formErrors, convertedValues) {
    if (formErrors) {
      return next(formErrors instanceof Error
        ? formErrors
        : new errors.BadRequest('Invalid data', { errors: formErrors }), hook
      );
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
export const validateUsingPromise = (validator, ...rest) => (hook) => {
  console.error('DEPRECATED Removed next ver. (validateUsingPromise)');
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
 * Call a validation function from a before hook. The function may be sync or return a Promise.
 *
 * @param {Function} validator - Validation function with signature function validator(formValues)
 *    If you have a different signature for the validator then pass a wrapper as the validator
 *      e.g. (values) => myValidator(..., values, ...)
 *    If your validator uses a callback, wrap your validator in a Promise
 *      const fnPromisify = require('feathers-hooks-common/lib/promisify').fnPromisifyCallback;
 *      const myValidator = fnPromisifyCallback(myCallbackValidator, 1);
 *      app.service('users').before({ create: validate(myValidator) });
 * @returns {Function} hook function(hook)
 *
 * Sync functions return either an error object or null. Validate will throw on an error
 * object with:
 *   throw new errors.BadRequest({ errors: errorObject });
 * Promise functions should throw on an error. Their .then returns either sanitized values to
 * replace hook.data, or null.
 */
export const validate = (validator) => (hook) => {
  checkContext(hook, 'before', ['create', 'update', 'patch'], 'validate');

  const res = validator(getItems(hook));

  if (res && typeof res.then === 'function') {
    return res.then(convertedValues => {
      if (convertedValues) { // if values have been sanitized
        replaceItems(hook, convertedValues);
      }

      return hook;
    });
  }

  // Sync function returns errors. It cannot sanitize.
  if (res && Object.keys(res).length) {
    throw new errors.BadRequest({ errors: res });
  }

  return hook;
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
