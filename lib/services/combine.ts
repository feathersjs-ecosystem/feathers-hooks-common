
const { processHooks } = require('@feathersjs/commons').hooks;

module.exports = function (...serviceHooks) {
  return function (context) {
    return processHooks.call(this, serviceHooks, context);
  };
};
