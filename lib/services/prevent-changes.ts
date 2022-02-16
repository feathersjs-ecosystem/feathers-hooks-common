// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'existsByDo... Remove this comment to see the full error message
const existsByDot = require('lodash/has');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

module.exports = function (...fieldNames: any[]) {
  const ifThrow = fieldNames[0];

  if (typeof ifThrow === 'string') {
    console.log('**Deprecated** Use the preventChanges(true, ...fieldNames) syntax instead.');
  } else {
    fieldNames = fieldNames.slice(1);
  }

  return (context: any) => {
    checkContext(context, 'before', ['patch'], 'preventChanges');
    const data = context.data;

    fieldNames.forEach(name => {
      if (existsByDot(data, name)) {
        if (ifThrow) {
          throw new errors.BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        }
        // Delete data.contactPerson.name
        context.data = omit(data, name);
      }
      // Delete data['contactPerson.name']
      if (data[name]) {
        if (ifThrow) throw new errors.BadRequest(`Field ${name} may not be patched. (preventChanges)`);
        delete data[name];
      }
    });

    return context;
  };
};
