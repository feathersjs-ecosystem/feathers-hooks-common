export const hasOwnProperty = (obj: Record<string, unknown>, ...keys: string[]): boolean => {
  return keys.some(x => Object.prototype.hasOwnProperty.call(obj, x));
};

export type MaybeArray<T> = T | T[];
export const toArray = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);

export type Promisable<T> = T | Promise<T>;
export type KeyOf<T> = Extract<keyof T, string>;
