export function isPromise(p: any): p is Promise<any> {
  return p instanceof Promise
}

export { setFields } from './set-fields.js'
export { transformItems } from './transform-items.js'
export { traverse } from './traverse.js'
export { clone } from './clone.js'
