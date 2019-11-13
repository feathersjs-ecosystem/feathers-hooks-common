const getByDot = require('lodash/get');
const errors = require('@feathersjs/errors');
const existsByDot = require('lodash/has');

const checkContext = require('./check-context');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  return context => {
    checkContext(context, 'before', ['create', 'update', 'patch'], 'required');
    const items = getItems(context);

    (Array.isArray(items) ? items : [items]).forEach(item => {
      fieldNames.forEach(name => {
        if (!existsByDot(item, name)) throw new errors.BadRequest(`Field ${name} does not exist. (required)`);
        const value = getByDot(item, name);
        if (!value && value !== 0 && value !== false) throw new errors.BadRequest(`Field ${name} is null. (required)`);
      });
    });
  };
};
