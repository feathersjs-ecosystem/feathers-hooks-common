import type { HookContext } from '@feathersjs/feathers';
import type { HookType, MethodName } from '../types';

const stndMethods = ['find', 'get', 'create', 'update', 'patch', 'remove'];

/**
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#checkcontext}
 */
export function checkContext (
  context: HookContext,
  type?: HookType | HookType[] | null,
  methods?: MethodName | MethodName[] | null,
  label = 'anonymous'
): void {
  if (type) {
    const types = Array.isArray(type) ? type : [type]; // safe enough for allowed values
    if (!types.includes(context.type)) {
      throw new Error(`The '${label}' hook can only be used as a '${type}' hook.`);
    }
  }

  if (!methods) { return; }
  if (stndMethods.indexOf(context.method) === -1) { return; } // allow custom methods

  const myMethods = Array.isArray(methods) ? methods : [methods]; // safe enough for allowed values

  if (myMethods.length > 0 && myMethods.indexOf(context.method) === -1) {
    const msg = JSON.stringify(myMethods);
    throw new Error(`The '${label}' hook can only be used on the '${msg}' service method(s).`);
  }
}
