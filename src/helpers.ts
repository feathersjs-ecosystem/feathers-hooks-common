export function isPromise (p: any): p is Promise<any> {
  return !!p && (typeof p === 'object' || typeof p === 'function') && typeof p.then === 'function';
}
