import type { Application, HookContext, Service } from '@feathersjs/feathers';

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#getitems}
 */
export function getItems <A = Application, S = Service> (context: HookContext<A, S>): any {
  // @ts-ignore
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const items = context.type === 'before' ? context.data : context.result;
  // @ts-ignore
  return items && context.method === 'find' ? items.data || items : items;
}
