
const checkContext = require('./check-context');

module.exports = function (context, type, methods, label) {
  if (type && context.type === type) {
    checkContext(context, type, methods, label);
  }
};
