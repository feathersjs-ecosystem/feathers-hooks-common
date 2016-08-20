'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.softDelete = undefined;

var _utils = require('./utils');

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
var softDelete = exports.softDelete = function softDelete(field) {
  return function (hook) {
    (0, _utils.checkContext)(hook, 'before', ['remove', 'find'], 'softDelete');

    if (hook.method === 'find') {
      hook.params.query = hook.params.query || {};
      (0, _utils.setByDot)(hook.data, (field || 'deleted') + '.$ne', true); // include non-deleted items only
      return hook;
    }

    hook.data = hook.data || {};
    (0, _utils.setByDot)(hook.data, field || 'deleted', true); // update the item as deleted

    return undefined.patch(hook.id, hook.data, hook.params).then(function (data) {
      hook.result = data; // Set the result from `patch` as the method call result
      return hook; // Always return the hook or `undefined`
    });
  };
};
/* eslint-env es6, node */
/* eslint no-param-reassign: 0, no-var: 0 */