import setByDot from 'lodash/set';

export default function (items: any /* modified */, fieldValue: any, fieldNames: any, defaultFieldName: any) {
  const value = typeof fieldValue === 'function' ? fieldValue() : fieldValue;

  if (!fieldNames.length) fieldNames = [defaultFieldName];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach((fieldName: any) => {
      setByDot(item, fieldName, value);
    });
  });
}
