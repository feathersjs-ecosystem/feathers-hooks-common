
const checkContext = require('./check-context');

module.exports = function (hook, type, methods, label) {
  if (type && hook.type === type) {
    checkContext(hook, type, methods, label);
  }
};
