
/* eslint-env es6, node */
/* eslint brace-style: 0, consistent-return: 0, no-console: 0, no-param-reassign: 0, no-var: 0 */

const errors = require('feathers-errors').errors;
import { getItems, replaceItems, getByDot, setByDot } from './utils';

/**
 * Lowercase the given fields either in the data submitted (as a before hook for create,
 * update or patch) or in the result (as an after hook). If the data is an array or
 * a paginated find result the hook will lowercase the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to lowercase. Dot notation is supported.
 * @returns {Function} hook function(hook).
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 */
export function lowerCase (...fields) {
  const lowerCaseFields = data => {
    for (const field of fields) {
      const value = getByDot(data, field);

      if (value !== undefined) {
        if (typeof value !== 'string' && value !== null) {
          throw new errors.BadRequest(`Expected string data. (lowercase ${field})`);
        }

        setByDot(data, field, value ? value.toLowerCase() : value);
      }
    }
  };

  var callback = () => true;
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (lowerCase)');
  }

  return function (hook) {
    const items = hook.type === 'before' ? hook.data : hook.result;

    const update = condition => {
      if (items && condition) {
        if (hook.method === 'find' || Array.isArray(items)) {
          // data.data if the find method is paginated
          (items.data || items).forEach(lowerCaseFields);
        } else {
          lowerCaseFields(items);
        }
      }
      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Remove the given fields from the query params.
 * Can be used as a before hook for any service method.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 */
export function removeQuery (...fields) {
  const removeQueries = data => {
    for (const field of fields) {
      const value = getByDot(data, field); // prevent setByDot creating nested empty objects
      if (value !== undefined) {
        setByDot(data, field, undefined, true);
      }
    }
  };

  var callback = () => true;
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (removeQuery)');
  }

  return function (hook) {
    if (hook.type === 'after') {
      const provider = hook.params.provider || 'server';
      throw new errors.GeneralError(
        `Provider '${provider}' cannot remove query params on after hook. (removeQuery)`
      );
    }
    const result = hook.params.query;
    const update = condition => {
      if (result && condition) {
        removeQueries(result);
      }
      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Discard all other fields except for the given fields from the query params.
 * Can be used as a before hook for any service method.
 *
 * @param {Array.<string|Function>} fields - Field names to retain. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 */
export function pluckQuery (...fields) {
  const pluckQueries = data => {
    const plucked = {};

    fields.forEach(field => {
      const value = getByDot(data, field); // prevent setByDot creating nested empty objects
      if (value !== undefined) {
        setByDot(plucked, field, value);
      }
    });

    return plucked;
  };

  var callback = () => true;
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (pluckQuery)');
  }

  return function (hook) {
    if (hook.type === 'after') {
      throw new errors.GeneralError(
        `Provider '${hook.params.provider}' can not pluck query params on after hook. (pluckQuery)`
      );
    }
    const result = hook.params.query;
    const update = condition => {
      if (result && condition) {
        hook.params.query = pluckQueries(result);
      }
      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Remove the given fields either from the data submitted (as a before hook for create,
 * update or patch) or from the result (as an after hook). If the data is an array or
 * a paginated find result the hook will remove the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
 * or if the decision function mentioned above returns true.
 */
export function remove (...fields) {
  const removeFields = data => {
    for (const field of fields) {
      const value = getByDot(data, field);
      if (value !== undefined) { // prevent setByDot creating nested empty objects
        setByDot(data, field, undefined, true);
      }
    }
  };

  // when deprecating, remember hook should not run if called from server
  var callback = (hook) => !!hook.params.provider; // important condition
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
  }

  return function (hook) {
    const result = hook.type === 'before' ? hook.data : hook.result;
    const update = condition => {
      if (result && condition) {
        if (Array.isArray(result)) {
          result.forEach(removeFields);
        } else {
          removeFields(result);

          if (result.data) {
            if (Array.isArray(result.data)) {
              result.data.forEach(removeFields);
            } else {
              removeFields(result.data);
            }
          }
        }
      }
      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Discard all other fields except for the provided fields either from the data submitted
 * (as a before hook for create, update or patch) or from the result (as an after hook).
 * If the data is an array or a paginated find result the hook will remove the field for every item.
 *
 * @param {Array.<string|Function>} fields - Field names to remove. Dot notation is supported.
 * @returns {Function} hook function(hook)
 *
 * DEPRECATED: The last param may be a function to determine if the current hook should be updated.
 * Its signature is func(hook) and it returns either a boolean or a promise resolving to a boolean.
 * This boolean determines if the hook is updated.
 *
 * hooks.lowerCase('group', hook => hook.data.status === 1);
 * hooks.lowerCase('group', hook => new Promise(resolve => {
 *   setTimeout(() => { resolve(true); }, 100)
 * }));
 *
 * The items are only updated for external requests, e.g. hook.params.provider is rest or socketio,
 * or if the decision function mentioned above returns true.
 */
export function pluck (...fields) {
  const pluckFields = data => {
    const plucked = {};

    fields.forEach(field => {
      const value = getByDot(data, field);
      if (value !== undefined) { // prevent setByDot creating nested empty objects
        setByDot(plucked, field, value);
      }
    });

    return plucked;
  };

  // when deprecating, remember hook should not run if called from server
  var callback = (hook) => !!hook.params.provider;
  if (typeof fields[fields.length - 1] === 'function') {
    callback = fields.pop();
    console.error('DEPRECATED Predicate func will be removed next version. (pluck)');
  }

  return function (hook) {
    const update = condition => {
      if (condition) {
        const items = getItems(hook);

        if (items) {
          if (Array.isArray(items)) {
            replaceItems(hook, items.map(pluckFields));
          } else {
            replaceItems(hook, pluckFields(items));
          }
        }
      }

      return hook;
    };

    const check = callback(hook);

    return check && typeof check.then === 'function' ? check.then(update) : update(check);
  };
}

/**
 * Disable access to a service method completely, for a specific provider,
 * or for a custom condition.
 *
 * @param {string|function} [realm] - Provider, or function(hook):boolean|Promise
 *    The first provider or the custom condition.
 *    null = disable completely,
 *    'external' = disable external access,
 *    string = disable that provider e.g. 'rest',
 *    func(hook) = returns boolean or promise resolving to a boolean. false = disable access.
 * @param {string|string[]} [args] - Additional provider names.
 * @returns {Function} hook function(hook)
 *
 * The function may be invoked with
 * - no param, or with undefined or null. All providers are disallowed, even the server.
 * - multiple params of provider names, e.g. rest, socketio. They are all disabled.
 * - 'external'. All client interfaces are disabled.
 * - a function whose signature is func(hook). It returns either a boolean or a promise which
 * resolves to a boolean. If false, the operation is disabled. This is the only way to disable
 * calls from the server.
 */
export function disable (realm, ...args) {
  if (!realm) {
    return function (hook) {
      throw new errors.MethodNotAllowed(`Calling '${hook.method}' not allowed. (disable)`);
    };
  }

  if (typeof realm === 'function') {
    return function (hook) {
      const result = realm(hook);
      const update = check => {
        if (!check) {
          throw new errors.MethodNotAllowed(`Calling '${hook.method}' not allowed. (disable)`);
        }
      };

      if (result && typeof result.then === 'function') {
        return result.then(update);
      }

      update(result);
    };
  }

  const providers = [realm].concat(args);

  return function (hook) {
    const provider = hook.params.provider;

    if ((realm === 'external' && provider) || providers.indexOf(provider) !== -1) {
      throw new errors.MethodNotAllowed(
        `Provider '${hook.params.provider}' can not call '${hook.method}'. (disable)'`
      );
    }
  };
}

/**
 * The populate hook uses a property from the result (or every item if it is a list)
 * to retrieve a single related object from a service and add it to the original object.
 * It is meant to be used as an after hook on any service method.
 *
 * @param {string} target - The prop name to contain the populated item or array of populated items.
 *    This is also the default for options.field if that is not specified.
 * @param {Object} options - options
 *    For a mongoose model, these are the options for item.toObject().
 *    For a Sequelize model, these are the options for item.toJSON().
 * @param {string} options.service - The service for the related object, e.g. '/messages'.
 * @param {string|Array.<string>} options.field - The field containing the key(s)
 *    for the item(s) in options.service.
 * @returns {Function} hook function(hook):Promise resolving to the hook.
 *
 * 'options.field' is the foreign key for one related item in options.service, i.e. item[options.field] === foreignItem[idField].
 * 'target' is set to this related item once it is read successfully.
 *
 * If 'options.field' is not present in the hook result item, the hook is ignored.
 *
 * So if the hook result has the message item
 *    { _id: '1...1', senderId: 'a...a', text: 'Jane, are you there?' }
 * and the /users service has the item
 *    { _id: 'a...a', name: 'John Doe'}
 * and then the hook is run
 *    hooks.populate('sender', { field: 'userId', service: '/users' })
 * the hook result will contain
 *    { _id: '1...1', senderId : 'a...a', text: 'Jane, are you there?',
 *      sender: { _id: 'a...a', name: 'John Doe'} }
 *
 * If 'senderId' is an array of keys, then 'sender' will be an array of populated items.
 */
export function legacyPopulate (target, options) {
  options = Object.assign({}, options);

  console.error(
    'Calling populate(target, options) is now DEPRECATED and will be removed in the future. ' +
    'Refer to docs.feathersjs.com for more information. (legacyPopulate)'
  );

  if (!options.service) {
    throw new Error('You need to provide a service. (populate)');
  }

  const field = options.field || target;

  return function (hook) {
    function populate1 (item) {
      if (!item[field]) {
        return Promise.resolve(item);
      }

      // Find by the field value by default or a custom query
      const id = item[field];

      // If it's a mongoose model then
      if (typeof item.toObject === 'function') {
        item = item.toObject(options);
      }
      // If it's a Sequelize model
      else if (typeof item.toJSON === 'function') {
        item = item.toJSON(options);
      }
      // Remove any query from params as it's not related
      const params = Object.assign({}, hook.params, { query: undefined });
      // If the relationship is an array of ids, fetch and resolve an object for each,
      // otherwise just fetch the object.
      const promise = Array.isArray(id)
        ? Promise.all(id.map(objectID => hook.app.service(options.service).get(objectID, params)))
        : hook.app.service(options.service).get(id, params);
      return promise.then(relatedItem => {
        if (relatedItem) {
          item[target] = relatedItem;
        }
        return item;
      });
    }

    if (hook.type !== 'after') {
      throw new errors.GeneralError('Can not populate on before hook. (populate)');
    }

    const isPaginated = hook.method === 'find' && hook.result.data;
    const data = isPaginated ? hook.result.data : hook.result;

    if (Array.isArray(data)) {
      return Promise.all(data.map(populate1)).then(results => {
        if (isPaginated) {
          hook.result.data = results;
        } else {
          hook.result = results;
        }

        return hook;
      });
    }

    // Handle single objects.
    return populate1(hook.result).then(item => {
      hook.result = item;
      return hook;
    });
  };
}
