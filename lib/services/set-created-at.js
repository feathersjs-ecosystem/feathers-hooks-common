
const _setFields = require('../common/_set-fields');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  console.log('**Deprecated** The setCreatedAt hook will be removed next FeathersJS version. Use setNow instead.');

  return hook => {
    _setFields(getItems(hook), () => new Date(), fieldNames, 'createdAt');
    return hook;
  };
};
