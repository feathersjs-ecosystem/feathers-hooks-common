export function isPromise (p: any): p is Promise<any> {
  return !!p && (typeof p === 'object' || typeof p === 'function') && typeof p.then === 'function';
}

export { pluck } from './pluck';
export { setFields } from './set-fields';
export { transformItems } from './transform-items';
export { traverse } from './traverse'
