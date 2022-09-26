import type { Application, HookContext, Service } from '@feathersjs/feathers';

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 *
 * @see https://hooks-common.feathersjs.com/utilities.html#getitems
 */
export function getItems<A extends Application = Application, S extends Service = Service>(
  context: HookContext<A, S>
): any {
  // @ts-ignore
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const items = context.type === 'before' ? context.data : context.result;
  // @ts-ignore
  return items && context.method === 'find' ? items.data || items : items;
}
