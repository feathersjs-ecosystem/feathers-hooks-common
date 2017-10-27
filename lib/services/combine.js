
const {
  processHooks
} = require('feathers-hooks/lib/commons');

module.exports = function (...serviceHooks) {
  return function (hook) {
    return processHooks.call(this, serviceHooks, hook);
  };
};
