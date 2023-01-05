import type { HookContext } from '@feathersjs/feathers';

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#getitems
 */
export function getItems<H extends HookContext = HookContext>(context: H): any {
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const itemOrItems = context.result !== undefined ? context.result : context.data;
  return itemOrItems && context.method === 'find' ? itemOrItems.data || itemOrItems : itemOrItems;
}
