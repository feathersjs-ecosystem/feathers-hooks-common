
import getByDot from './get-by-dot';
import setByDot from './set-by-dot';

export default function (items, fieldNames) {
  if (!Array.isArray(items)) {
    return _pluckItem(items, fieldNames);
  }

  const pluckedItems = [];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    pluckedItems.push(_pluckItem(item, fieldNames));
  });

  return pluckedItems;
}

function _pluckItem (item, fieldNames) {
  const plucked = {};

  fieldNames.forEach(fieldName => {
    const value = getByDot(item, fieldName);
    if (value !== undefined) { // prevent setByDot creating nested empty objects
      setByDot(plucked, fieldName, value);
    }
  });

  return plucked;
}
