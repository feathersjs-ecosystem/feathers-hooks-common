
const existsByDot = require('../common/exists-by-dot');
const deleteByDot = require('../common/delete-by-dot');
const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');

module.exports = function (...fieldNames) {
  const ifThrow = fieldNames[0];
  const deprecated = typeof ifThrow === 'string'

  if (!deprecated) {
    fieldNames = fieldNames.slice(1);
  }

  return context => {
    checkContext(context, 'before', ['patch'], 'preventChanges');
    const data = context.data;

    if (deprecated) {
      console.log('**Deprecated** Use the preventChanges(true, ...fieldNames) syntax instead.');
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
