import type { Hook, HookContext, Query, Application } from '@feathersjs/feathers';
import type { Ajv, ErrorObject as ajvErrorObject, Options as AjvOptions } from 'ajv';
import type { parse, GraphQLFieldResolver } from 'graphql';

export type HookType = 'before' | 'after' | 'error';
export type MethodName = 'find' | 'create' | 'get' | 'update' | 'patch' | 'remove';
export type TransportName = 'socketio' | 'primus' | 'rest' | 'external' | 'server';
export type Disablable = 'populate' | 'fastJoin' | 'ignoreDeletedAt' | 'softDelete' | 'softDelete2' | 'stashBefore';

export type SyncContextFunction<T> = (context: HookContext) => T;
export type AsyncContextFunction<T> = (context: HookContext) => Promise<T>;
export type ContextFunction<T> = (context: HookContext) => T | Promise<T>;

export type SyncPredicateFn = SyncContextFunction<boolean>;
export type AsyncPredicateFn = AsyncContextFunction<boolean>;
export type PredicateFn = ContextFunction<boolean>;

export type CacheMap<T> = Map<string, T>;

export interface CacheOptions<T, K> {
  clone?(item: T): T;
  makeCacheKey?(id: K): string;
}

export interface CallingParamsOptions {
  /**
   * The params.query for the calling params.
   */
  query?: any;
  /**
   * The names of the props in context.params to include in the new params.
   */
  propNames?: string[];
  /**
   * Additional props to add to the new params.
   */
  newProps?: any;
  /**
   * The names of hooks to disable during the service call. populate, fastJoin, softDelete and stashBefore are supported.
   */
  hooksToDisable?: Disablable[] | Disablable;
  /**
   *    Ignore the defaults propNames and newProps.
   */
  ignoreDefaults?: boolean;
}

export interface ResolverContext<T = any> extends HookContext<T> {
  _loaders: any;
}

export type SimpleResolver<T> = (...args: any[]) => (item: T, context: ResolverContext) => Promise<any>;

export interface RecursiveResolver<T> {
  resolver: SimpleResolver<T>;
  joins: ResolverMap<any>;
}

export interface ResolverMap<T> {
  after?: (context: ResolverContext) => void | Promise<void>;
  before?: (context: ResolverContext) => void | Promise<void>;
  joins: {
    [property: string]: SimpleResolver<T> | RecursiveResolver<T>;
  };
}

export type FGraphQLResolverMapFactory = (app: Application, runtime: any) => FGraphQLResolverMap;

export interface FGraphQLResolverMap {
  [i: string]: {
      [i: string]: GraphQLFieldResolver<any, any>
  };
  Query: {
      [i: string]: GraphQLFieldResolver<any, any>
  };
}

export interface FGraphQLOptions {
  skipHookWhen?: SyncContextFunction<boolean>;
  inclAllFieldsServer?: boolean;
  inclAllFieldsClient?: boolean;
  inclAllFields?: boolean;
  inclJoinedNames?: boolean;
  extraAuthProps?: string[];
}

export interface FGraphQLHookOptions {
  recordType: string;
  schema: string;
  resolvers: FGraphQLResolverMap | FGraphQLResolverMapFactory;
  query: Query | SyncContextFunction<Query>;
  options?: FGraphQLOptions;
  runTime: any;
  parse: typeof parse;
}

export interface PopulateOptions {
  schema: Partial<PopulateSchema> | ((context: HookContext, options: PopulateOptions) => Partial<PopulateSchema>);
  checkPermissions?: (context: HookContext, path: string, permissions: any, depth: number) => boolean;
  profile?: boolean;
}

export interface PopulateSchema {
  /**
   * The name of the service providing the items, actually its path.
   */
  service: string;
  /**
   * Where to place the items from the join
   * dot notation
   */
  nameAs: string;
  /**
   * The name of the field in the parent item for the relation.
   * dot notation
   */
  parentField: string;
  /**
   * The name of the field in the child item for the relation.
   * Dot notation is allowed and will result in a query like { 'name.first': 'John' } which is not suitable for all DBs.
   * You may use query or select to create a query suitable for your DB.
   */
  childField: string;

  /**
   * Who is allowed to perform this join. See checkPermissions above.
   */
  permissions: any;

  /**
   * An object to inject into context.params.query.
   */
  query: any;

  /**
   * A function whose result is injected into the query.
   */
  select: (context: HookContext, parentItem: any, depth: number) => any;

  /**
   * Force a single joined item to be stored as an array.
   */
  asArray: boolean;

  /**
   * Controls pagination for this service.
   */
  paginate: boolean | number;

  /**
   * Perform any populate or fastJoin registered on this service.
   */
  useInnerPopulate: boolean;
  /**
   * Call the service as the server, not with the client’s transport.
   */
  provider: string;
  include: Partial<PopulateSchema> | Partial<PopulateSchema>[];
}

export interface SerializeSchema {
  only?: string | string[];
  exclude?: string | string[];
  computed?: {
      [propName: string]: (record: any, context: HookContext) => any
  };

  [key: string]: SerializeSchema | SerializeSchema['computed'] | string | string[] | undefined;
}

export interface SequelizeConversion {
  js: (sqlValue: any) => any;
  sql: (jsValue: any) => any;
}

export interface SequelizeConverts<C> {
  [name: string]: keyof C | 'boolean' | 'date' | 'json';
}

export type SoftDeleteOptionFunction = (context?: HookContext) => Promise<{ [key: string]: any }>;

export interface SoftDeleteOptions {
  deletedQuery?: { [key: string]: any } | SoftDeleteOptionFunction;
  removeData?: { [key: string]: any } | SoftDeleteOptionFunction;
}

export type SyncValidatorFn = (values: any, context: HookContext) => { [key: string]: string } | null;
export type AsyncValidatorFn = (values: any, context: HookContext) => Promise<object | null>;
export type ValidatorFn = SyncValidatorFn | AsyncValidatorFn;

export type AjvOrNewable = Ajv | (new (options?: AjvOptions) => Ajv);

export interface ValidateSchemaOptions extends AjvOptions {
  /**
   * The hook will throw if the data does not match the JSON-Schema. error.errors will, by default, contain an array
   * of error messages. You may change this with a custom formatting function. Its a reducing function which works
   * similarly to Array.reduce().
   */
  addNewError: (currentFormattedMessages: any, ajvErrorObject: ajvErrorObject, itemsLen: number, itemIndex: number) => any;
}

export interface IffHook extends Hook {
  else(...hooks: Hook[]): Hook;
}

export interface SetFieldOptions {
  as: string
  from: string
  allowUndefined?: boolean
}
