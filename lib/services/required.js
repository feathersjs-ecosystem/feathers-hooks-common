
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');
const getItems = require('./get-items');
const getByDot = require('../common/get-by-dot');
const existsByDot = require('../common/exists-by-dot');

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
