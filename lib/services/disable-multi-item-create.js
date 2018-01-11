
const errors = require('@feathersjs/errors');
const checkContext = require('./check-context');

module.exports = function () {
  return function (context) {
    checkContext(context, 'before', ['create'], 'disableMultiItemCreate');

    if (Array.isArray(context.data)) {
      throw new errors.BadRequest(
        `Multi-record creations not allowed for ${context.path} ${context.method}. (disableMultiItemCreate)`
      );
    }
  };
};
