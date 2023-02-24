import type { HookContext } from '@feathersjs/feathers';

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#getitems
 */
export function getItems<H extends HookContext = HookContext>(context: H): any {
  // @ts-ignore
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const items = context.type === 'before' ? context.data : context.result;
  // @ts-ignore
  return items && context.method === 'find' ? items.data || items : items;
}
