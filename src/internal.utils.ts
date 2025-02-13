export const hasOwnProperty = (obj: Record<string, unknown>, ...keys: string[]): boolean => {
  return keys.some(x => Object.prototype.hasOwnProperty.call(obj, x));
};
