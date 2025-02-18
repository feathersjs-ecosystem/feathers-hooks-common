export function isPromise(p: any): p is Promise<any> {
  return p instanceof Promise;
}

export { setFields } from './set-fields';
export { transformItems } from './transform-items';
export { traverse } from './traverse';
export { clone } from './clone';
