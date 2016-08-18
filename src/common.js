
/* eslint-env es6, node */
/* eslint  max-len: 0, no-console: 0, no-param-reassign: 0, no-shadow: 0, no-var: 0 */

const hooks = require('feathers-authentication').hooks;
const errors = require('feathers-errors');
const utils = require('feathers-hooks-utils');

/**
 * Add a createdAt field (for before/after, create/update/patch).
 *
 * @param {Object} options - Field name is options.as or 'createdAt'.
 * @returns {Function} hook function(hook)
 *
 * module.exports.before = {
 *   create: [ hooksCommon.setCreatedAt() ]
 * };
 */
module.exports.setCreatedAt = (options) => {
  const name = (options && options.as) ? options.as : 'createdAt';
  return (hook) => {
    utils.set(hook, name, new Date());
  };
};

/**
 * Add/update an updatedAt field (for before/after, create/update/patch).
 *
 * @param {Object} options - Field name is options.as or 'updatedAt'.
 * @returns {Function} hook function
 *
 * module.exports.before = {
 *   all: [ hooksCommon.setUpdatedAt() ]
 * };
 */
module.exports.setUpdatedAt = (options) => {
  const name = (options && options.as) ? options.as : 'updatedAt';
  return (hook) => {
    utils.set(hook, name, new Date());
  };
};

/**
 * Normalize slug, placing it in hook.params.query.
 *
 * @param {string} slug - name e.g. 'storeId' for http://.../stores/:storeId/...
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
 * all: [ hooksCommon.setSlug('storeId') ]
 * provides a normalized hook.params.query of { size: 'large', storeId: '123' }.
 *
 * module.exports.before = {
 *   all: [ hooksCommon.setSlug('storeId') ]
 * };
 */
module.exports.setSlug = (slug) => (hook) => {
  if (hook.params && hook.params.provider === 'rest') {
    const value = hook.params[slug];

    // Handle raw HTTP call. feathers-client rest api calls cannot send a slug value.
    // They must already include the slug in the query object.
    if (typeof value === 'string' && value[0] !== ':') {
      if (!hook.params.query) { hook.params.query = {}; }
      hook.params.query[slug] = value;
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
 *   create: [ hooksCommon.debug('step 1') ]
 * };
 */
module.exports.debug = (msg) => (
  (hook) => {
    console.log(`* ${msg || ''}\ntype:${hook.type}, method: ${hook.method}`);
    if (hook.data) { console.log('data:', hook.data); }
    if (hook.params && hook.params.query) { console.log('query:', hook.params.query); }
    if (hook.result) { console.log('result:', hook.result); }
  }
);

/**
 * Factory for Feathers hooks.restrictToRoles.
 *
 * @param {?array|string} [defaultRoles=[]] - Roles authorized to continue. Default [].
 * @param {?string} rolesFieldName - Name of field containing roles. Default 'roles'.
 * @param {?boolean} defaultIfOwner - If record owner authorized to continue. Default false.
 * @param {?string} ownerFieldName - Name of field containing owner ID. Default 'ownerId'.
 * @returns {Function} hook function(hook, next)
 *
 * Example:
 * const authorizer = hooksCommon.restrictToRoles([], 'allowedRoles', false, 'ownerId');
 * module.exports.before = {
 *   all: [ authorizer(['purchasing', 'accounting']) ]
 * }
 */
module.exports.restrictToRoles =
  (defaultRoles, rolesFieldName = 'roles', defaultIfOwner = false, ownerFieldName = 'ownerId') => {
    if (!defaultRoles) { defaultRoles = []; }

    return (roles, ifOwner) => hooks.restrictToRoles({
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
module.exports.validateSync = (validator, ...rest) => (hook) => {
  utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateSync');

  const formErrors = validator(utils.get(hook), ...rest);

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
module.exports.validateUsingCallback = (validator, ...rest) => (hook, next) => {
  utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingCallback');
  const rest1 = rest.concat(cb);

  validator(utils.get(hook), ...rest1);

  function cb(formErrors, convertedValues) {
    if (formErrors) {
      return next(formErrors instanceof Error ? formErrors : { errors: formErrors });
    }

    if (convertedValues) {
      utils.setAll(hook, convertedValues);
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
module.exports.validateUsingPromise = (validator, ...rest) => (hook) => {
  utils.checkContext(hook, 'before', ['create', 'update', 'patch'], 'validateUsingPromise');

  return validator(utils.get(hook), ...rest)
    .then(convertedValues => {
      if (convertedValues) {
        utils.setAll(hook, convertedValues);
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
 * const hooks = require('feathers-hooks');
 * const hooksCommon = require('feathers-hooks-common');
 * const validateSchema = require('feathers-hooks-validate-joi');
 * const verifyReset = app.service('/verifyReset/:action/:value');
 *
 * create: [
 *   validateSchema.form(schemas.signup, schemas.options), // schema validation
 *   hooksCommon.validateSync(usersClientValidations.signup),  // redo redux-form client validation
 *   hooksCommon.validateUsingPromise( // redo redux-form async validation, for uniqueness
 *     (values) => verifyReset.create( // wrap call for compatibility with validateUsingPromise
 *       { action: 'unique', value: { username: values.username, email: values.email } }
 *     )
 *   ),
 *   hooksCommon.validateUsingCallback(usersServerValidations.signup, {}), // server validation
 *   hooks.remove('confirmPassword'),
 *   auth.hashPassword(),
 * ],
 *
 * See feathersjs-starter-react-redux-login for a working example.
 */
