const setByDot = require('lodash/set');
const errors = require('@feathersjs/errors');

const _transformItems = require('../common/_transform-items');
const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'lowercase');

    _transformItems(getItems(context), fieldNames, (item, fieldName, value) => {
      if (value !== undefined) {
        if (typeof value !== 'string' && value !== null) {
          throw new errors.BadRequest(`Expected string data. (lowercase ${fieldName})`);
        }

        setByDot(item, fieldName, value ? value.toLowerCase() : value);
      }
    });

    return context;
  };
};
