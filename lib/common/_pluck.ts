const pick = require('lodash/pick');

module.exports = function (items, fieldNames) {
  if (!Array.isArray(items)) {
    return pick(items, fieldNames);
  }

  const pluckedItems = (Array.isArray(items) ? items : [items])
    .map(item => pick(item, fieldNames));

  return pluckedItems;
};
