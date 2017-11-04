
const { processHooks } = require('@feathersjs/commons').hooks;

module.exports = function (...serviceHooks) {
  return function (hook) {
    return processHooks.call(this, serviceHooks, hook);
  };
};
