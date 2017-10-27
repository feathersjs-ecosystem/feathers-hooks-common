
const feathersErrors = require('feathers-errors');
const _transformItems = require('../common/_transform-items');
const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const setByDot = require('../common/set-by-dot');

const errors = feathersErrors.errors;

module.exports = function (...fieldNames) {
  return hook => {
    checkContextIf(hook, 'before', ['create', 'update', 'patch'], 'lowercase');

    _transformItems(getItems(hook), fieldNames, (item, fieldName, value) => {
      if (value !== undefined) {
        if (typeof value !== 'string' && value !== null) {
          throw new errors.BadRequest(`Expected string data. (lowercase ${fieldName})`);
        }

        setByDot(item, fieldName, value ? value.toLowerCase() : value);
      }
    });

    return hook;
  };
};
