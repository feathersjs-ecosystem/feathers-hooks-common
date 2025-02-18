import type { HookContext } from '@feathersjs/feathers';

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#getitems
 *
 * @deprecated Use `getDataIsArray` or `getResultIsArray` instead.
 */
export function getItems<H extends HookContext = HookContext>(context: H): any {
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const items = context.type === 'before' ? context.data : context.result;
  return items && context.method === 'find' ? items.data || items : items;
}
