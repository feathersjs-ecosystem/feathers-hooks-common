import _pick from 'lodash/pick.js';

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
    return _pick(items, fieldNames);
  }

  const pluckedItems = (Array.isArray(items) ? items : [items])
    .map(item => _pick(item, fieldNames));

  return pluckedItems;
}
