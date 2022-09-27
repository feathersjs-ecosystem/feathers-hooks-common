import type { HookContext } from '@feathersjs/feathers';
import type { HookFunction } from '../types';
import { combine } from '../utils/combine';

/**
 * Runs a series of hooks which mutate context.data or context.result (the Feathers default).
 * @see https://hooks-common.feathersjs.com/hooks.html#actondefault
 */
export const actOnDefault = <H extends HookContext = HookContext>(...hooks: HookFunction<H>[]) =>
  actOn(undefined, ...hooks);

/**
 * Runs a series of hooks which mutate context.dispatch.
 * @see https://hooks-common.feathersjs.com/hooks.html#actondispatch
 */
export const actOnDispatch = <H extends HookContext = HookContext>(...hooks: HookFunction<H>[]) =>
  actOn('dispatch', ...hooks);

function actOn<H extends HookContext = HookContext>(what: any, ...hooks: HookFunction<H>[]) {
  return async (context: H) => {
    // @ts-ignore
    const currActOn = context.params._actOn;
    // @ts-ignore
    context.params._actOn = what;

    const newContext = await combine(...hooks)(context);
    newContext.params._actOn = currActOn;
    return newContext;
  };
}
