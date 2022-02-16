const setByDot = require('lodash/set');

module.exports = function (items /* modified */, fieldValue, fieldNames, defaultFieldName) {
  const value = typeof fieldValue === 'function' ? fieldValue() : fieldValue;

  if (!fieldNames.length) fieldNames = [defaultFieldName];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(fieldName => {
      setByDot(item, fieldName, value);
    });
  });
};
