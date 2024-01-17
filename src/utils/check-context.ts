import type { HookContext } from '@feathersjs/feathers';
import { methodNames } from '../types';
import type { HookType, MethodName } from '../types';

/**
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * @see https://hooks-common.feathersjs.com/utilities.html#checkcontext
 */
export function checkContext<H extends HookContext = HookContext>(
  context: H,
  type?: HookType | HookType[] | null,
  methods?: MethodName | MethodName[] | null,
  label = 'anonymous',
): void {
  if (type) {
    const types = Array.isArray(type) ? type : [type]; // safe enough for allowed values
    if (!types.includes(context.type)) {
      throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
    }
  }

  if (!methods) {
    return;
  }
  if (!methodNames.includes(context.method as any)) {
    return;
  } // allow custom methods

  const methodsArr = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (methodsArr.length > 0 && !methodsArr.includes(context.method as any)) {
    const msg = JSON.stringify(methodsArr);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
}
