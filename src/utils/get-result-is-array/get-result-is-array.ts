import { HookContext } from '@feathersjs/feathers';

export function getResultIsArray<H extends HookContext = HookContext>(
  context: H,
  dispatch?: boolean,
): { isArray: boolean; result: any[]; key: 'dispatch' | 'result' } {
  const result = dispatch ? context.dispatch : context.result;

  if (!result) {
    return {
      isArray: false,
      result: [],
      key: dispatch ? 'dispatch' : 'result',
    };
  }

  const items = context.method === 'find' ? result.data || result : result;

  const isArray = Array.isArray(items);

  return {
    isArray,
    result: isArray ? items : items ? [items] : [],
    key: dispatch ? 'dispatch' : 'result',
  };
}
