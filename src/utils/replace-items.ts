import type { Application, HookContext, Service } from '@feathersjs/feathers';

/**
 * Replace the records in context.data or context.result[.data]. (Utility function.)
 * @see https://hooks-common.feathersjs.com/utilities.html#replaceitems
 */
export function replaceItems<A extends Application = Application, S extends Service = Service>(
  context: HookContext<A, S>,
  items: any
): void {
  // @ts-ignore
  if (context.params && context.params._actOn === 'dispatch') {
    context.dispatch = items;
    return;
  }

  if (context.type === 'before') {
    context.data = items;
  } else if (context.method === 'find' && context.result && context.result.data) {
    context.result.data = Array.isArray(items) ? items : [items];
  } else {
    context.result = items;
  }
}
