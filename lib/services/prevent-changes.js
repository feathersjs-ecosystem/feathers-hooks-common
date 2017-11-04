
const existsByDot = require('../common/exists-by-dot');
const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');

module.exports = function (...fieldNames) {
  return hook => {
    checkContext(hook, 'before', ['patch'], 'preventChanges');
    const data = hook.data;

    fieldNames.forEach(name => {
      if (existsByDot(data, name)) {
        throw new errors.BadRequest(`${name} may not be patched. (preventChanges)`);
      }
    });
  };
};
