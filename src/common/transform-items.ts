import _get from 'lodash/get';

export function transformItems <T extends Record<string, any>> (
  items: T | T[],
  fieldNames: string[],
  transformer: (item: T, fieldName: string, val: any) => void
): void {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach((fieldName: any) => {
      const value = _get(item, fieldName);
      if (value === undefined) {
        return
      }

      transformer(item, fieldName, _get(item, fieldName));
    });
  });
}
