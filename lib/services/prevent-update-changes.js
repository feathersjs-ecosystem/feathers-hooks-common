const getByDot = require('../common/get-by-dot');
const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');
const isEqual = require('lodash.isequal');

function defaultGetFunc (context) {
  const params = { query: context.params.query };
  if (context.id === undefined || context.id === null) {
    return Promise.resolve(context.service.find(params))
      // strip away pagination information if existent
      .then((result) => result.data || result);
  }
  return context.service.get(context.id, params);
}

module.exports = function (getFunc = defaultGetFunc, ...fieldNames) {
  return context => {
    checkContext(context, 'before', ['update'], 'preventUpdateChanges');
    const data = context.data;

    return Promise.resolve(getFunc(context))
      .then((result) => {
        const resultArray = Array.isArray(result) ? result : [result];

        resultArray.forEach((entry) => {
          fieldNames.forEach(name => {
            const entryVal = getByDot(entry, name);
            if (!isEqual(getByDot(data, name), entryVal)) {
              throw new errors.BadRequest(`Field ${name} may not be changed. (preventUpdateChanges)`);
            }
          });
        });
      })
      .then(() => context);
  };
};
