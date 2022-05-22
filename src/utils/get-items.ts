import type { HookContext } from '@feathersjs/feathers';

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#getitems}
 */
export function getItems (context: HookContext): any {
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const items = context.type === 'before' ? context.data : context.result;
  return items && context.method === 'find' ? items.data || items : items;
}
