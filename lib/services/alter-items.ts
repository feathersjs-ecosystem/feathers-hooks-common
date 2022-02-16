// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

module.exports = function (func: any) {
  if (!func) {
    func = () => {};
  }

  if (typeof func !== 'function') {
    throw new errors.BadRequest('Function required. (alter)');
  }

  return (context: any) => {
    let items = getItems(context);
    const isArray = Array.isArray(items);

    const results = (isArray ? items : [items]).map((item: any) => func(item, context));

    const hasPromises = results.some((result: any) => typeof result === 'object' && result !== null && typeof result.then === 'function'
    );

    const setItem = (value: any, index: any) => {
      if (typeof value === 'object' && value !== null) {
        if (isArray) {
          items[index] = value;
        } else {
          items = value;
        }
      }
    };

    if (hasPromises) {
      return Promise.all(results)
        .then(values => {
          values.forEach(setItem);

          replaceItems(context, items);
          return context;
        });
    } else {
      results.forEach(setItem);

      replaceItems(context, items);
      return context;
    }
  };
};
