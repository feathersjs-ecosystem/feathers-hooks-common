
const _setFields = require('../common/_set-fields');

module.exports = function (...fieldNames) {
  return data => {
    _setFields(data, () => new Date(), fieldNames, 'filteredAt');
    return data;
  };
};
