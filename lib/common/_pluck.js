
const getByDot = require('./get-by-dot');
const setByDot = require('./set-by-dot');

module.exports = function (items, fieldNames) {
  if (!Array.isArray(items)) {
    return _pluckItem(items, fieldNames);
  }

  const pluckedItems = [];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    pluckedItems.push(_pluckItem(item, fieldNames));
  });

  return pluckedItems;
};

function _pluckItem (item, fieldNames) {
  const plucked = {};

  fieldNames.forEach(fieldName => {
    const value = fieldName in item ? item[fieldName] : getByDot(item, fieldName);
    if (value !== undefined) { // prevent setByDot creating nested empty objects
      if (fieldName in item) { plucked[fieldName] = value; } else { setByDot(plucked, fieldName, value); }
    }
  });

  return plucked;
}
