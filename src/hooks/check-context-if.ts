import type { HookContext } from '@feathersjs/feathers';
import type { MethodName, HookType } from '../types';
import { checkContext } from '../utils/check-context';

/**
 * Like checkContext, but only if the given type matches the hook's type.
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#checkcontextif}
 */
export function checkContextIf (
  context: HookContext,
  type: HookType,
  methods: MethodName | MethodName[] | null,
  label: string
) {
  if (type && context.type === type) {
    checkContext(context, type, methods, label);
  }
}
