import _set from 'lodash/set.js';

export function setFields <T extends Record<string, any>> (
  items: T | T[],
  fieldValue: any | (() => any),
  fieldNames: string[],
  defaultFieldName: string
): void {
  const value = typeof fieldValue === 'function' ? fieldValue() : fieldValue;

  if (!fieldNames.length) fieldNames = [defaultFieldName];

  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach((fieldName: any) => {
      _set(item, fieldName, value);
    });
  });
}
