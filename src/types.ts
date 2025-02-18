import type { HookContext, Params } from '@feathersjs/feathers';

export const hookTypes = ['around', 'before', 'after', 'error'] as const;
export type HookType = (typeof hookTypes)[number];

export const methodNames = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const;
export type MethodName = (typeof methodNames)[number] | ({} & string); // allow custom methods

export type TransportName = 'socketio' | 'rest' | 'external' | 'server';

export type SyncContextFunction<T, H extends HookContext = HookContext> = (context: H) => T;
export type AsyncContextFunction<T, H extends HookContext = HookContext> = (
  context: H,
) => Promise<T>;
export type ContextFunction<T, H extends HookContext = HookContext> = (
  context: H,
) => T | Promise<T>;

export type SyncPredicateFn<H extends HookContext = HookContext> = (context: H) => boolean;
export type AsyncPredicateFn<H extends HookContext = HookContext> = (
  context: H,
) => Promise<boolean>;

export type PredicateFn<H extends HookContext = HookContext> = (
  context: H,
) => boolean | Promise<boolean>;

export declare type HookFunction<H extends HookContext = HookContext> = (
  context: H,
) => Promise<H | void> | H | void;

export type TransformParamsFn<P extends Params = Params> = (params: P) => P | void;

export type DispatchOption = boolean | 'both';
