// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');

module.exports = function (items: any /* modified */, fieldValue: any, fieldNames: any, defaultFieldName: any) {
  const value = typeof fieldValue === 'function' ? fieldValue() : fieldValue;

  if (!fieldNames.length) fieldNames = [defaultFieldName];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach((fieldName: any) => {
      setByDot(item, fieldName, value);
    });
  });
};
