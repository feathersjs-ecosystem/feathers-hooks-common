
const SKIP = require('@feathersjs/feathers').SKIP;

module.exports = function (predicate = context => !!context.result) {
  return context => (typeof predicate === 'function' ? predicate(context) : predicate) ? SKIP : context;
};
