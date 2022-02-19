import pick from 'lodash/pick';

export function pluck <T extends Record<string, any>> (
  items: T,
  fieldNames: string[]
): Record<string, any>
export function pluck <T extends Record<string, any>> (
  items: T[],
  fieldNames: string[]
): Record<string, any>[]
export function pluck <T extends Record<string, any>> (
  items: T | T[],
  fieldNames: string[]
): Record<string, any> | Record<string, any>[] {
  if (!Array.isArray(items)) {
    return pick(items, fieldNames);
  }

  const pluckedItems = (Array.isArray(items) ? items : [items])
    .map(item => pick(item, fieldNames));

  return pluckedItems;
}
