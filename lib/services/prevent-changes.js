
const existsByDot = require('../common/exists-by-dot');
const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');

module.exports = function (...fieldNames) {
  return context => {
    checkContext(context, 'before', ['patch'], 'preventChanges');
    const data = context.data;

    fieldNames.forEach(name => {
      if (existsByDot(data, name)) {
        throw new errors.BadRequest(`${name} may not be patched. (preventChanges)`);
      }
    });
  };
};
