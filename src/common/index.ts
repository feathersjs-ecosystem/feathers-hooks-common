export function isPromise(p: any): p is Promise<any> {
  return p instanceof Promise
}

export { traverse } from './traverse.js'
export { clone } from './clone.js'
