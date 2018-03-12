const getByDot = require('../common/get-by-dot');
const setByDot = require('../common/set-by-dot');
const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');
const isEqual = require('lodash.isequal');

const defaultGetFunc = (context) =>
  context.service.get(context.id, { query: context.params.query });

module.exports = function (getFunc = defaultGetFunc, ifThrow, ...fieldNames) {
  return context => {
    checkContext(context, 'before', ['update'], 'preventUpdateChanges');
    const data = context.data;

    return Promise.resolve(getFunc(context))
      .then((result) => {
        fieldNames.forEach(name => {
          const resultVal = getByDot(result, name);

          if (!isEqual(getByDot(data, name), resultVal)) {
            if (ifThrow) throw new errors.BadRequest(`Field ${name} may not be changed. (preventUpdateChanges)`);
            setByDot(data, name, resultVal);
          }
        });

        return context;
      });
  };
};
