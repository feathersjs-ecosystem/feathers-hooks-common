
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
