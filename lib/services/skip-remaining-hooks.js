
const SKIP = require('@feathersjs/feathers').SKIP;
const runPredicate = require('../common/_runPredicate');

module.exports = function (predicate = context => !!context.result) {
  return context => runPredicate(predicate, this, context)
    .then(result => result ? SKIP : context);
};
