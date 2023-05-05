import type { HookContext } from '@feathersjs/feathers';

/**
 * Set a generator on paginated results that returns an iterator with result arrays
 * @see https://hooks-common.feathersjs.com/hooks.html#next
 */

async function* generateNext({ result, service, args = { query: {} } }) {
  yield result.data
  let pager = result
  while (true) {
    args.query.$skip = (pager.limit + pager.skip) % pager.total
    pager = await service.find(args)
    yield pager.data
    if (pager.total < pager.limit + pager.skip) break
  }
}
export function next<HookContext>(ctx) {
  return (context: H) =>  (context.result.next = context.result.skip === 0 ? next(context) : undefined)
}
