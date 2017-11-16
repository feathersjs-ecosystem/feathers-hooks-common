
const _setFields = require('../common/_set-fields');
const getItems = require('./get-items');

module.exports = function (...fieldNames) {
  console.log('**Deprecated** The setCreatedAt hook will be removed next FeathersJS version. Use setNow instead.');

  return context => {
    _setFields(getItems(context), () => new Date(), fieldNames, 'createdAt');
    return context;
  };
};
