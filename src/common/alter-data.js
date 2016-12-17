// ALTERING DATA
// done remove
// done pluck
// traverse
// setFilteredAt ?

// OTHERS
// validateSchema ? (no factory required)

const traverser = require('traverse');
import { getByDot, setByDot } from '../utils';

export const _remove = (items, fieldNames) => {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(field => {
      const value = getByDot(item, field);
      if (value !== undefined) { // prevent setByDot creating nested empty objects
        setByDot(item, field, undefined, true);
      }
    });
  });

  return items;
};

export const _pluck = (items, fieldNames) => {
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

  fieldNames.forEach(field => {
    const value = getByDot(item, field);
    if (value !== undefined) { // prevent setByDot creating nested empty objects
      setByDot(plucked, field, value);
    }
  });

  return plucked;
}

export const _traverse = (items, converter) => {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
};

export const _setFields = (items, fieldValue, fieldNames) => {
  const value = typeof fieldValue === 'function' ? fieldValue() : fieldValue;

  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(field => {
      setByDot(item, field, value);
    });
  });
};
