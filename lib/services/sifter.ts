
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

module.exports = function (getSifter: any) {
  return (context: any) => {
    checkContext(context, 'after', 'find', 'sifter');

    if (typeof getSifter !== 'function') {
      throw new errors.BadRequest('The sifter param must be a function. (sifter)');
    }

    const sifter = getSifter(context);

    if (typeof sifter !== 'function') {
      throw new errors.BadRequest('The result of calling the sifter param must be a function. (sifter)');
    }

    replaceItems(context, getItems(context).filter(sifter));

    return context;
  };
};
