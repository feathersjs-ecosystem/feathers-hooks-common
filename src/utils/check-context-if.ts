import type { HookContext } from '@feathersjs/feathers';
import type { MethodName, HookType } from '../types';
import { checkContext } from './check-context';

// TODO: Add checkContextIf to docs
/**
 * Like checkContext, but only if the given type matches the hook's type.
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 *
 * @see https://hooks-common.feathersjs.com/hooks.html#checkcontextif
 */
export function checkContextIf<H extends HookContext = HookContext>(
  context: H,
  type: HookType | HookType[],
  methods?: MethodName | MethodName[] | null,
  label?: string,
) {
  if (Array.isArray(type) ? !type.includes(context.type) : type !== context.type) {
    return;
  }

  checkContext(context, type, methods, label);
}
