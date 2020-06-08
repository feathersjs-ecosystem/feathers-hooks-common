// TypeScript Version: 3.0

import { Hook, HookContext, Params, Query, Paginated, Application } from '@feathersjs/feathers';
import * as ajv from 'ajv';
import { GraphQLSchema, parse, GraphQLFieldResolver } from 'graphql';

export type HookType = 'before' | 'after' | 'error';
export type MethodName = 'find' | 'create' | 'get' | 'update' | 'patch' | 'remove';
export type TransportName = 'socketio' | 'primus' | 'rest' | 'external' | 'server';
export type Disablable = 'populate' | 'fastJoin' | 'ignoreDeletedAt' | 'softDelete' | 'softDelete2' | 'stashBefore';

export type SyncContextFunction<T> = (context: HookContext) => T;
export type AsyncContextFunction<T> = (context: HookContext) => Promise<T>;

export type SyncPredicateFn = SyncContextFunction<boolean>;
export type AsyncPredicateFn = AsyncContextFunction<boolean>;
export type PredicateFn = SyncPredicateFn | AsyncPredicateFn;

/**
 * Runs a series of hooks which mutate context.data or context.result (the Feathers default).
 * {@link https://hooks-common.feathersjs.com/hooks.html#ActOnDefault}
 */
export function actOnDefault(...hooks: Hook[]): Hook;

/**
 * Runs a series of hooks which mutate context.dispatch.
 * {@link https://hooks-common.feathersjs.com/hooks.html#ActOnDispatch}
 */
export function actOnDispatch(...hooks: Hook[]): Hook;

/**
 * Make changes to data or result items. Very flexible.
 * {@link https://hooks-common.feathersjs.com/hooks.html#AlterItems}
 */
export function alterItems<T = any>(cb: (record: T, context: HookContext<T>) => any): Hook;

export type CacheMap<T> = Map<string, T>;

export interface CacheOptions<T, K> {
    clone?(item: T): T;

    makeCacheKey?(id: K): string;
}

/**
 * Persistent, most-recently-used record cache for services.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Cache}
 */
export function cache<T, K extends keyof T>(cacheMap: CacheMap<T>, keyField?: K, options?: CacheOptions<T, K>): Hook;

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

/**
 * Build params for a service call. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#CallingParams}
 */
export function callingParams(options: CallingParamsOptions): SyncContextFunction<Params>;

/**
 * Set defaults for building params for service calls with callingParams. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#CallingParamsDefaults}
 */
export function callingParamsDefaults(propNames: string[], newProps: any): void;

/**
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#CheckContext}
 */
export function checkContext(context: HookContext, type?: HookType | HookType[] | null, methods?: MethodName | MethodName[] | null, label?: string): void;

/**
 * Like checkContext, but only if the given type matches the hook's type.
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#CheckContextIf}
 */
export function checkContextIf(context: HookContext, type: HookType, methods?: MethodName | MethodName[] | null, label?: string): void;

/**
 * Sequentially execute multiple sync or async hooks.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Combine}
 */
export function combine(...hooks: Hook[]): Hook;

/**
 * Display the current hook context for debugging.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Debug}
 */
export function debug(msg: string, ...fieldNames: string[]): Hook;

/**
 * Remove records and properties created by the populate hook.
 * {@link https://hooks-common.feathersjs.com/hooks.html#DePopulate}
 */
export function dePopulate(): Hook;

/**
 * Disables pagination when query.$limit is -1 or '-1'.
 * {@link https://hooks-common.feathersjs.com/hooks.html#DisablePagination}
 */
export function disablePagination(): Hook;

/**
 * Prevents access to a service method completely or for specific transports.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Disallow}
 */
export function disallow(...transports: TransportName[]): Hook;

/**
 * Delete certain fields from the record(s).
 * {@link https://hooks-common.feathersjs.com/hooks.html#Discard}
 */
export function discard(...fieldNames: string[]): Hook;

/**
 * Delete certain fields from the query object.
 * {@link https://hooks-common.feathersjs.com/hooks.html#DiscardQuery}
 */
export function discardQuery(...fieldNames: string[]): Hook;

/**
 * Check if a property exists in an object by using dot notation, e.g. address.city. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#ExistsByDot}
 */
export function existsByDot(object: any, path: string): boolean;

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

/**
 * We often want to combine rows from two or more tables based on a relationship between them. The fastJoin hook
 * will select records that have matching values in both tables. It can batch service calls and cache records,
 * thereby needing roughly an order of magnitude fewer database calls than the populate hook, i.e. 2 calls instead
 * of 20. It uses a GraphQL-like imperative API.
 *
 * fastJoin is not restricted to using data from Feathers services. Resources for which there are no Feathers
 * adapters can also be used.
 *
 *
 * fastJoin(postResolvers)
 * fastJoin(postResolvers, query)
 * fastJoin(context => postResolvers)
 * fastJoin(postResolvers, context => query) // supports queries from client
 * {@link https://hooks-common.feathersjs.com/hooks.html#FastJoin}
 */
export function fastJoin(resolvers: ResolverMap<any> | SyncContextFunction<ResolverMap<any>>, query?: Query | SyncContextFunction<Query>): Hook;

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

/**
 * Generate Graphql Resolvers for services
 * {@link https://medium.com/@eddyystop/38faee75dd1}
 */
export function fgraphql(options?: FGraphQLHookOptions): Hook;

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#GetItems}
 */
export function getItems(context: HookContext): any; // any[] | any | undefined;

/**
 * Check which transport provided the service call.
 * {@link https://hooks-common.feathersjs.com/hooks.html#IsProvider}
 */
export function isProvider(...transports: TransportName[]): SyncContextFunction<boolean>;

/**
 * Keep certain fields in the record(s), deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Keep}
 */
export function keep(...fieldNames: string[]): Hook;

/**
 * Keep certain fields in a nested array inside the record(s), deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#KeepInArray}
 */
export function keepInArray(arrayName: string, fieldNames: string[]): Hook;

/**
 * Keep certain fields in the query object, deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#KeepQuery}
 */
export function keepQuery(...fieldNames: string[]): Hook;

/**
 * Keep certain fields in a nested array inside the query object, deleting the rest.
 * {@link https://hooks-common.feathersjs.com/hooks.html#KeepQueryInArray}
 */
export function keepQueryInArray(arrayName: string, fieldNames: string[]): Hook;

/**
 * Convert certain field values to lower case.
 * {@link https://hooks-common.feathersjs.com/hooks.html#LowerCase}
 */
export function lowerCase(...fieldNames: string[]): Hook;

/**
 * You should prefer using the callingParams utility to makeCallingParams.
 * Build context.params for service calls. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#MakeCallingParams}
 */
export function makeCallingParams(context: HookContext, query: any, include: string | string[], inject: object): Params;

/**
 * Wrap MongoDB foreign keys in ObjectID.
 * {@link https://hooks-common.feathersjs.com/hooks.html#MongoKeys}
 */
export function mongoKeys(objectId: new (id?: string | number) => any, keyFields: string | string[]): Hook;

/**
 * Pass an explicit context.params from client to server. Client-side. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#ParamsForServer}
 */
export function paramsForServer(params: Params, ...whitelist: string[]): Params;

/**
 * Pass context.params from client to server. Server hook.
 * {@link https://hooks-common.feathersjs.com/hooks.html#ParamsFromClient}
 */
export function paramsFromClient(...whitelist: string[]): Hook;

export interface PopulateOptions {
    schema: Partial<PopulateSchema>;

    checkPermissions?: boolean;
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
    include: Partial<PopulateSchema> | Array<Partial<PopulateSchema>>;
}

/**
 * Join related records.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Populate}
 */
export function populate(options: PopulateOptions): Hook;

/**
 * Prevent patch service calls from changing certain fields.
 * {@link https://hooks-common.feathersjs.com/hooks.html#PreventChanges}
 */
export function preventChanges(ifThrow: boolean, ...fieldNames: string[]): Hook;

/**
 * Replace the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#ReplaceItems}
 */
export function replaceItems(context: HookContext, records: any): void;

/**
 * Check selected fields exist and are not falsey. Numeric 0 is acceptable.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Required}
 */
export function required(...fieldNames: string[]): Hook;

/**
 * Let's you call a hook right after the service call. (Utility function.)
 * {@link https://hooks-common.feathersjs.com/hooks.html#RunHook}
 */
export function runHook(context?: HookContext): (hook: Hook) => (data: any[] | Paginated<any>) => Promise<any>;

/**
 * Run a hook in parallel to the other hooks and the service call.
 * {@link https://hooks-common.feathersjs.com/hooks.html#RunParallel}
 */
export function runParallel<T = any>(hook: Hook, clone: (item: T) => T, depth?: number): Hook;

export interface SerializeSchema {
    only?: string | string[];
    exclude?: string | string[];
    computed?: {
        [propName: string]: (record: any, context: HookContext) => any
    };

    [key: string]: SerializeSchema | SerializeSchema['computed'] | string | string[] | undefined;
}

/**
 * Prune values from related records. Calculate new values.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Serialize}
 */
export function serialize(schema?: SerializeSchema | SyncContextFunction<SerializeSchema>): Hook;

/**
 * Create/update certain fields to the current date-time.
 * {@link https://hooks-common.feathersjs.com/hooks.html#SetNow}
 */
export function setNow(...fieldNames: string[]): Hook;

/**
 * Fix slugs in URL, e.g. /stores/:storeId.
 * {@link https://hooks-common.feathersjs.com/hooks.html#SetSlug}
 */
export function setSlug(slug: string, fieldName?: string): Hook;

export interface SequelizeConversion {
    js: (sqlValue: any) => any;
    sql: (jsValue: any) => any;
}

export interface SequelizeConverts<C> {
    [name: string]: keyof C | 'boolean' | 'date' | 'json';
}

/**
 * {@link https://hooks-common.feathersjs.com/hooks.html#SequelizeConvert}
 */
export function sequelizeConvert<C extends {[name: string]: SequelizeConversion}>(
    converts: SequelizeConverts<C> | null | undefined | false,
    ignores: string[] | null | undefined | false,
    conversions?: C
): Hook;

/**
 * Filter data or result records using a MongoDB-like selection syntax.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Sifter}
 */
export function sifter(siftFunc: SyncContextFunction<(item: any) => boolean>): Hook;

export type SoftDeleteOptionFunction = (context?: HookContext) => Promise<{ [key: string]: any }>;

export interface SoftDeleteOptions {
    deletedQuery?: { [key: string]: any } | SoftDeleteOptionFunction;
    removeData?: { [key: string]: any } | SoftDeleteOptionFunction;
}

/**
 * Allow to mark items as deleted instead of removing them.
 */
export function softDelete(options: SoftDeleteOptions): Hook;

/**
 * Stash current value of record, usually before mutating it. Performs a get call.
 * {@link https://hooks-common.feathersjs.com/hooks.html#StashBefore}
 */
export function stashBefore(fieldName?: string): Hook;

/**
 * Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
 * Check docs at https://github.com/substack/js-traverse for info on transformContext!
 * {@link https://hooks-common.feathersjs.com/hooks.html#Traverse}
 */
export function traverse(transformer: (this: any, transformContext: any) => any, getObject?: SyncContextFunction<any>): Hook;

export type SyncValidatorFn = (values: any, context: HookContext) => { [key: string]: string } | null;
export type AsyncValidatorFn = (values: any, context: HookContext) => Promise<object | null>;
export type ValidatorFn = SyncValidatorFn | AsyncValidatorFn;

/**
 * Validate data using a validation function.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Validate}
 */
export function validate(validator: ValidatorFn): Hook;

export type AjvOrNewable = ajv.Ajv | (new (options?: ajv.Options) => ajv.Ajv);

export interface ValidateSchemaOptions extends ajv.Options {
    /**
     * The hook will throw if the data does not match the JSON-Schema. error.errors will, by default, contain an array
     * of error messages. You may change this with a custom formatting function. Its a reducing function which works
     * similarly to Array.reduce().
     */
    addNewError: (currentFormattedMessages: any, ajvErrorObject: ajv.ErrorObject, itemsLen: number, itemIndex: number) => any;
}

/**
 * Validate data using JSON-Schema.
 * {@link https://hooks-common.feathersjs.com/hooks.html#ValidateSchema}
 */
export function validateSchema(schema: object, ajv: AjvOrNewable, options?: ValidateSchemaOptions): Hook;

/**
 * Execute one array of hooks or another based on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#IffElse}
 */
export function iffElse(predicate: boolean | PredicateFn, hooksTrue: Hook | Hook[], hooksFalse: Hook | Hook[]): Hook;

export interface IffHook extends Hook {
    else(...hooks: Hook[]): Hook;
}

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Iff}
 */
export function iff(predicate: boolean | PredicateFn, ...hooks: Hook[]): IffHook;

/**
 * Alias for iff
 * Execute one or another series of hooks depending on a sync or async predicate.
 */
export const when: typeof iff;

/**
 * Execute a series of hooks if a sync or async predicate is falsey.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Unless}
 */
export function unless(predicate: boolean | PredicateFn, ...hooks: Hook[]): Hook;

/**
 * Return the or of a series of sync or async predicate functions.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Some}
 */
export function some(...predicates: PredicateFn[]): AsyncPredicateFn;

/**
 * Return the and of a series of sync or async predicate functions.
 * {@link https://hooks-common.feathersjs.com/hooks.html#Every}
 */
export function every(...predicates: PredicateFn[]): AsyncPredicateFn;

/**
 * Negate a sync or async predicate function.
 * {@link https://hooks-common.feathersjs.com/hooks.html#IsNot}
 */

export function isNot(predicate: boolean | PredicateFn): AsyncPredicateFn;
