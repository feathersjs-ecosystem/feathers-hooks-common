
const { processHooks } = require('@feathersjs/commons').hooks;

module.exports = function (...serviceHooks: any[]) {
  return function(this: any, context: any) {
    return processHooks.call(this, serviceHooks, context);
  };
};
