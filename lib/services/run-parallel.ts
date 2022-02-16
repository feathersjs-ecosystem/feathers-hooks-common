
// Original version by bedeoverend
const errors = require('@feathersjs/errors');

module.exports = function (func, clone, cloneDepth = 6) {
  if (typeof func !== 'function') {
    throw new errors.BadRequest('Function not provided. (runParallel)');
  }

  return function (context) { // must use function
    const copy = cloneDepth ? clone(context, true, cloneDepth) : context;

    setTimeout(() => func.call(this, copy));
  };
};
