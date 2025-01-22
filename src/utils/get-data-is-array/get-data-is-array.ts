import { HookContext } from '@feathersjs/feathers';

export function getDataIsArray<H extends HookContext = HookContext>(
  context: H,
): { data: any[]; isArray: boolean } {
  if (!context.data) {
    return {
      isArray: false,
      data: [],
    };
  }

  const isArray = Array.isArray(context.data);

  return {
    isArray,
    data: isArray ? context.data : [context.data],
  };
}
