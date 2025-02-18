import type { HookContext } from '@feathersjs/feathers';
import type { HookType, MethodName } from '../../types';
import { isContext } from '../../predicates/is-context/is-context';

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
  if (
    !isContext({
      method: methods ?? undefined,
      type: type ?? undefined,
    })(context)
  ) {
    throw new Error(`The '${label}' hook has invalid context.`);
  }
}
