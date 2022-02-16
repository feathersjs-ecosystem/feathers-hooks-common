
// Original version by bedeoverend
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');

module.exports = function (func: any, clone: any, cloneDepth = 6) {
  if (typeof func !== 'function') {
    throw new errors.BadRequest('Function not provided. (runParallel)');
  }

  return function(this: any, context: any) { // must use function
    const copy = cloneDepth ? clone(context, true, cloneDepth) : context;

    setTimeout(() => func.call(this, copy));
  };
};
