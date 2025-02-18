import type { HookContext } from '@feathersjs/feathers';

/**
 * Replace the records in context.data or context.result[.data]. (Utility function.)
 * @see https://hooks-common.feathersjs.com/utilities.html#replaceitems
 *
 * @deprecated Use `replaceData` or `replaceResult` instead.
 */
export function replaceItems<H extends HookContext = HookContext>(context: H, items: any): void {
  if (context.params && context.params._actOn === 'dispatch') {
    if (context.method === 'find' && context.dispatch?.data) {
      context.dispatch.data = Array.isArray(items) ? items : [items];
    } else {
      context.dispatch = items;
    }
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
