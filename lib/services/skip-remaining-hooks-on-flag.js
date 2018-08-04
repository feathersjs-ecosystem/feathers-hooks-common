
const skipRemainingHooks = require('./skip-remaining-hooks');

module.exports = function (flagNames = ['$rawRecord']) {
  flagNames = Array.isArray(flagNames) ? flagNames : [flagNames];

  return context => skipRemainingHooks(
    context => context.params && flagNames.some(name => context.params[name])
  )(context);
};
