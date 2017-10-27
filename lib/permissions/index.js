
const combine = require('./combine');
const _conditionals = require('../common/_conditionals');

const conditionals = _conditionals(
  function (hookFnArgs, permissionsHooks) {
    return permissionsHooks ? combine(...permissionsHooks).call(this, hookFnArgs[0]) : hookFnArgs[0];
  });

module.exports = Object.assign({ combine }, conditionals);
