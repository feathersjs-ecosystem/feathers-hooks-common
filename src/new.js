
/* eslint-env es6, node */
/* eslint no-param-reassign: 0, no-var: 0 */

import { setByDot, checkContext } from './utils';

/**
 * Mark an item as deleted rather than removing it from the database.
 *
 * @param {string} field - Field for delete status. Supports dot notation. Default is 'deleted'.
 *
 * export.before = {
 *   remove: [ softDelete() ], // update item flagging it as deleted
 *   find: [ softDelete() ] // ignore deleted items
 * };
 */
export const softDelete = (field) => (hook) => {
  checkContext(hook, 'before', ['remove', 'find'], 'softDelete');

  if (hook.method === 'find') {
    hook.params.query = hook.params.query || {};
    setByDot(hook.data, `${field || 'deleted'}.$ne`, true);// include non-deleted items only
    return hook;
  }

  hook.data = hook.data || {};
  setByDot(hook.data, field || 'deleted', true); // update the item as deleted

  return this.patch(hook.id, hook.data, hook.params).then(data => {
    hook.result = data; // Set the result from `patch` as the method call result
    return hook; // Always return the hook or `undefined`
  });
};

/**
 * Hook to conditionally execute another hook.
 *
 * @param {Function|Promise|boolean} ifFcn - Predicate function. Execute hookFcn if result is true.
 * @param {Function|Promise} hookFcn - Hook function to execute.
 * @returns {Object} hook
 *
 * feathers-hooks will catch any errors from the predicate or hook Promises
 */
export const iff = (ifFcn, hookFcn) => (hook) => {
  const check = typeof ifFcn === 'function' ? ifFcn(hook) : !!ifFcn;

  if (!check) {
    return hook;
  }

  if (typeof check.then !== 'function') {
    return hookFcn(hook); // could be sync or async
  }

  return check.then(check1 => {
    if (!check1) {
      return Promise.resolve(hook);
    }

    const result = hookFcn(hook); // could be sync or async

    if (!result || typeof result.function !== 'function') {
      return Promise.resolve(result);
    }

    return result;
  });
};
