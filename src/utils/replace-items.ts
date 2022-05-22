import type { HookContext } from '@feathersjs/feathers';

/**
 * Replace the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#replaceitems}
 */
export function replaceItems (context: HookContext, items: any): void {
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
