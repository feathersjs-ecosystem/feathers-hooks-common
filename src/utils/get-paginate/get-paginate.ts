import type { PaginationOptions } from '@feathersjs/adapter-commons'
import type { HookContext } from '@feathersjs/feathers'
import { hasOwnProperty } from '../../internal.utils.js'

/**
 * util to get paginate options from context
 * 1. it uses `context.params.paginate` if it exists
 * 2. it uses `service.options.paginate` if it exists
 * 3. it uses `context.params.adapter` if it exists
 */
export const getPaginate = <H extends HookContext = HookContext>(
  context: H,
): PaginationOptions | undefined => {
  if (hasOwnProperty(context.params, 'paginate')) {
    return (context.params.paginate as PaginationOptions) || undefined
  }

  if (context.params.paginate === false) {
    return undefined
  }
  let options = context.service?.options || {}

  options = {
    ...options,
    ...context.params.adapter,
  }

  return options.paginate || undefined
}
