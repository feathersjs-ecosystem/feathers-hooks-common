
const existsByDot = require('../common/exists-by-dot');
const deleteByDot = require('../common/delete-by-dot');
const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');

module.exports = function (...fieldNames) {
  return context => {
    checkContext(context, 'before', ['patch'], 'preventChanges');
    const data = context.data;
    const ifThrow = fieldNames[0];

    if (typeof ifThrow === 'string') {
      console.log('**Deprecated** Use the preventChanges(true, ...fieldNames) syntax instead.');
    } else {
      fieldNames = fieldNames.slice(1);
    }

    fieldNames.forEach(name => {
      if (existsByDot(data, name)) {
        if (ifThrow) throw new errors.BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        deleteByDot(data, name);
      }
    });

    return context;
  };
};
