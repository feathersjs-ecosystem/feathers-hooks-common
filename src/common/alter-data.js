
const traverser = require('traverse');
import { getByDot, setByDot } from '../hooks/utils';

// transformer(item /* modified */, fieldName, value)
export const _transformItems = (items /* modified */, fieldNames, transformer) => {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(fieldName => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
};

export const _remove = (items /* modified */, fieldNames) => {
  _transformItems(items, fieldNames, (item, fieldName, value) => {
    if (value !== undefined) {
      setByDot(item, fieldName, undefined, true);
    }
  });
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

  fieldNames.forEach(fieldName => {
    const value = getByDot(item, fieldName);
    if (value !== undefined) { // prevent setByDot creating nested empty objects
      setByDot(plucked, fieldName, value);
    }
  });

  return plucked;
}

export const _traverse = (items, converter) => {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
};

export const _setFields = (items /* modified */, fieldValue, fieldNames, defaultFieldName) => {
  const value = typeof fieldValue === 'function' ? fieldValue() : fieldValue;

  if (!fieldNames.length) fieldNames = [defaultFieldName];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(fieldName => {
      setByDot(item, fieldName, value);
    });
  });
};
