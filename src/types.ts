import type { HookContext } from '@feathersjs/feathers';

export const hookTypes = ['around', 'before', 'after', 'error'] as const;
export type HookType = typeof hookTypes[number];

export const methodNames = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const;
export type MethodName = typeof methodNames[number];

export type TransportName = 'socketio' | 'rest' | 'external' | 'server';

export type SyncContextFunction<T, H extends HookContext = HookContext> = (context: H) => T;
export type AsyncContextFunction<T, H extends HookContext = HookContext> = (
  context: H
) => Promise<T>;
export type ContextFunction<T, H extends HookContext = HookContext> = (
  context: H
) => T | Promise<T>;

export type SyncPredicateFn<H extends HookContext = HookContext> = SyncContextFunction<boolean, H>;
export type AsyncPredicateFn<H extends HookContext = HookContext> = AsyncContextFunction<
  boolean,
  H
>;
export type PredicateFn<H extends HookContext = HookContext> = ContextFunction<boolean, H>;

export declare type HookFunction<H extends HookContext = HookContext> = (
  context: H
) => Promise<H | void> | H | void;
