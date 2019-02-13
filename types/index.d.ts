// TypeScript Version: 2.6

import { Hook, HookContext, Params, Query, Paginated, Application } from '@feathersjs/feathers';
import * as ajv from 'ajv';
import { GraphQLSchema, parse, GraphQLFieldResolver } from 'graphql';
import * as libphonenumberjs from 'libphonenumber-js';

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
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ActOnDefault}
 */
export function actOnDefault(...hooks: Hook[]): Hook;

/**
 * Runs a series of hooks which mutate context.dispatch.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ActOnDispatch}
 */
export function actOnDispatch(...hooks: Hook[]): Hook;

/**
 * Make changes to data or result items. Very flexible.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#AlterItems}
 */
export function alterItems<T = any>(cb: (record: T, context: HookContext<T>) => any): Hook;

export type CacheMap<T> = Map<string, T>;

export interface CacheOptions<T, K> {
    clone?(item: T): T;

    makeCacheKey?(id: K): string;
}

/**
 * Persistent, least-recently-used record cache for services.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Cache}
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
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#CallingParams}
 */
export function callingParams(options: CallingParamsOptions): SyncContextFunction<Params>;

/**
 * Set defaults for building params for service calls with callingParams. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#CallingParamsDefaults}
 */
export function callingParamsDefaults(propNames: string[], newProps: any): void;

/**
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#CheckContext}
 */
export function checkContext(context: HookContext, type?: HookType | HookType[] | null, methods?: MethodName | MethodName[] | null, label?: string): void;

/**
 * Like checkContext, but only if the given type matches the hook's type.
 * Restrict a hook to run for certain methods and method types. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#CheckContextIf}
 */
export function checkContextIf(context: HookContext, type: HookType, methods?: MethodName | MethodName[] | null, label?: string): void;

/**
 * Sequentially execute multiple sync or async hooks.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Combine}
 */
export function combine(...hooks: Hook[]): Hook;

/**
 * Display the current hook context for debugging.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Debug}
 */
export function debug(msg: string, ...fieldNames: string[]): Hook;

/**
 * Deletes a property from an object using dot notation, e.g. address.city. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DeleteByDot}
 */
export function deleteByDot(object: any, path: string): void;

/**
 * Remove records and properties created by the populate hook.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DePopulate}
 */
export function dePopulate(): Hook;

// todo: dialablePhoneNumber docs
/**
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DialablePhoneNumber}
 */
export function dialablePhoneNumber(
    libphonenumberJs: typeof libphonenumberjs,
    defaultCountry?: libphonenumberjs.CountryCode,
    phoneField?: string,
    dialableField?: string,
    countryField?: string
): Hook;

/**
 * Prevents null from being used as an id in patch and remove service methods.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DisableMultiItemChange}
 */
export function disableMultiItemChange(): Hook;

/**
 * Prevents multi-item creates.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DisableMultiItemCreate}
 */
export function disableMultiItemCreate(): Hook;

/**
 * Disables pagination when query.$limit is -1 or '-1'.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DisablePagination}
 */
export function disablePagination(): Hook;

/**
 * Prevents access to a service method completely or for specific transports.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Disallow}
 */
export function disallow(...transports: TransportName[]): Hook;

/**
 * Delete certain fields from the record(s).
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Discard}
 */
export function discard(...fieldNames: string[]): Hook;

/**
 * Delete certain fields from the query object.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#DiscardQuery}
 */
export function discardQuery(...fieldNames: string[]): Hook;

/**
 * Check if a property exists in an object by using dot notation, e.g. address.city. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ExistsByDot}
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
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#FastJoin}
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
 * Return a property value from an object using dot notation, e.g. address.city. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#GetByDot}
 */
export function getByDot(object: object, path: string): any;

/**
 * Get the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#GetItems}
 */
export function getItems(context: HookContext): any; // any[] | any | undefined;

/**
 * Check which transport provided the service call.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#IsProvider}
 */
export function isProvider(...transports: TransportName[]): SyncContextFunction<boolean>;

/**
 * Keep certain fields in the record(s), deleting the rest.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Keep}
 */
export function keep(...fieldNames: string[]): Hook;

/**
 * Keep certain fields in a nested array inside the record(s), deleting the rest.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#KeepInArray}
 */
export function keepInArray(arrayName: string, fieldNames: string[]): Hook;

/**
 * Keep certain fields in the query object, deleting the rest.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#KeepQuery}
 */
export function keepQuery(...fieldNames: string[]): Hook;

/**
 * Keep certain fields in a nested array inside the query object, deleting the rest.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#KeepQueryInArray}
 */
export function keepQueryInArray(arrayName: string, fieldNames: string[]): Hook;

/**
 * Convert certain field values to lower case.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#LowerCase}
 */
export function lowerCase(...fieldNames: string[]): Hook;

/**
 * You should prefer using the callingParams utility to makeCallingParams.
 * Build context.params for service calls. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#MakeCallingParams}
 */
export function makeCallingParams(context: HookContext, query: any, include: string | string[], inject: object): Params;

/**
 * Wrap MongoDB foreign keys in ObjectID.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#MongoKeys}
 */
export function mongoKeys(objectId: new (id?: string | number) => any, keyFields: string | string[]): Hook;

/**
 * Pass an explicit context.params from client to server. Client-side. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ParamsForServer}
 */
export function paramsForServer(params: Params, ...whitelist: string[]): Params;

/**
 * Pass context.params from client to server. Server hook.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ParamsFromClient}
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
    include: Partial<PopulateSchema>;
}

/**
 * Join related records.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Populate}
 */
export function populate(options: PopulateOptions): Hook;

/**
 * Prevent patch service calls from changing certain fields.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#PreventChanges}
 */
export function preventChanges(ifThrow: boolean, ...fieldNames: string[]): Hook;

/**
 * Replace the records in context.data or context.result[.data]. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ReplaceItems}
 */
export function replaceItems(context: HookContext, records: any): void;

/**
 * Check selected fields exist and are not falsey. Numeric 0 is acceptable.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Required}
 */
export function required(...fieldNames: string[]): Hook;

/**
 * Let's you call a hook right after the service call. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#RunHook}
 */
export function runHook(context?: HookContext): (hook: Hook) => (data: any[] | Paginated<any>) => Promise<any>;

/**
 * Run a hook in parallel to the other hooks and the service call.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#RunParallel}
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
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Serialize}
 */
export function serialize(schema?: SerializeSchema | SyncContextFunction<SerializeSchema>): Hook;

/**
 * Set a property value in an object using dot notation, e.g. address.city. (Utility function.)
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SetByDot}
 */
export function setByDot(object: object, path: string, value: any): void;

/**
 * Create/update certain fields to the current date-time.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SetNow}
 */
export function setNow(...fieldNames: string[]): Hook;

/**
 * Fix slugs in URL, e.g. /stores/:storeId.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SetSlug}
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
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SequelizeConvert}
 */
export function sequelizeConvert<C extends {[name: string]: SequelizeConversion}>(
    converts: SequelizeConverts<C> | null | undefined | false,
    ignores: string[] | null | undefined | false,
    conversions?: C
): Hook;

/**
 * Filter data or result records using a MongoDB-like selection syntax.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Sifter}
 */
export function sifter(siftFunc: SyncContextFunction<(item: any) => boolean>): Hook;

/**
 * Conditionally skip running all remaining hooks.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SkipRemainingHooks}
 */
export function skipRemainingHooks(predicate?: SyncPredicateFn | boolean): Hook;

export function skipRemainingHooksOnFlag(flagNames: string | string[]): Hook;

export interface SoftDelete2Options {
    deletedAt?: string;
    keepOnCreate?: boolean;
    skipProbeOnGet?: boolean;
    allowIgnoreDeletedAt?: boolean;
    probeCall?: (context: HookContext, options: SoftDelete2Options) => Promise<any>;
    patchCall?: (context: HookContext, options: SoftDelete2Options) => Promise<any>;
}

/**
 * Flag records as logically deleted instead of physically removing them.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SoftDelete2}
 */
export function softDelete2(options?: SoftDelete2Options): Hook;

/**
 * Stash current value of record, usually before mutating it. Performs a get call.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#StashBefore}
 */
export function stashBefore(fieldName?: string): Hook;

/**
 * Transform fields & objects in place in the record(s) using a recursive walk. Powerful.
 * Check docs at https://github.com/substack/js-traverse for info on transformContext!
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Traverse}
 */
export function traverse(transformer: (this: any, transformContext: any) => any, getObject?: SyncContextFunction<any>): Hook;

export type SyncValidatorFn = (values: any, context: HookContext) => { [key: string]: string } | null;
export type AsyncValidatorFn = (values: any, context: HookContext) => Promise<object | null>;
export type ValidatorFn = SyncValidatorFn | AsyncValidatorFn;

/**
 * Validate data using a validation function.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Validate}
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
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#ValidateSchema}
 */
export function validateSchema(schema: object, ajv: AjvOrNewable, options?: ValidateSchemaOptions): Hook;

/**
 * Execute one array of hooks or another based on a sync or async predicate.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#IffElse}
 */
export function iffElse(predicate: PredicateFn, hooksTrue: Hook | Hook[], hooksFalse: Hook | Hook[]): Hook;

export interface IffHook extends Hook {
    else(...hooks: Hook[]): Hook;
}

/**
 * Execute one or another series of hooks depending on a sync or async predicate.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Iff}
 */
export function iff(predicate: PredicateFn, ...hooks: Hook[]): IffHook;

/**
 * Alias for iff
 * Execute one or another series of hooks depending on a sync or async predicate.
 */
export const when: typeof iff;

/**
 * Execute a series of hooks if a sync or async predicate is falsey.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Unless}
 */
export function unless(predicate: boolean | PredicateFn, ...hooks: Hook[]): Hook;

/**
 * Return the or of a series of sync or async predicate functions.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Some}
 */
export function some(...predicates: PredicateFn[]): AsyncPredicateFn;

/**
 * Return the and of a series of sync or async predicate functions.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Every}
 */
export function every(...predicates: PredicateFn[]): AsyncPredicateFn;

/**
 * Negate a sync or async predicate function.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#IsNot}
 */
export function isNot(predicate: PredicateFn): AsyncPredicateFn;

/**
 * @deprecated Deprecated callbackToPromise in favor of Node’s require('util').promisify.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#CallbackToPromise}
 */
export function callbackToPromise(...args: any[]): any;

/**
 * @deprecated Deprecated client in favor of paramsFromClient for naming consistency.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Client}
 */
export function client(...args: any[]): any;

/**
 * @deprecated Deprecated pluck in favor of keep, e.g. iff(isProvider('external'), keep(...fieldNames)). This deprecates the last hook with unexpected internal “magic”. Be careful!
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Pluck}
 */
export function pluck(...args: any[]): any;

/**
 * @deprecated Deprecated pluckQuery in favor of keepQuery for naming consistency.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#PluckQuery}
 */
export function pluckQuery(...args: any[]): any;

/**
 * @deprecated Deprecated promiseToCallback as there’s probably no need for it anymore.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#PromiseToCallback}
 */
export function promiseToCallback(...args: any[]): any;

/**
 * @deprecated Deprecated removeQuery in favor of discardQuery for naming consistency.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#RemoveQuery}
 */
export function removeQuery(...args: any[]): any;

/**
 * @deprecated Deprecated in favor of setNow.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SetCreatedAt}
 */
export function setCreatedAt(...args: any[]): any;

/**
 * @deprecated Deprecated in favor of setNow.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SetUpdatedAt}
 */
export function setUpdatedAt(...args: any[]): any;

/**
 * @deprecated DEPRECATED. Use the softDelete2 hook instead. It is a noteable improvement over softDelete.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#SoftDelete}
 */
export function softDelete(...args: any[]): any;

/**
 * @deprecated DEPRECATED. Use disallow instead.
 * {@link https://feathers-plus.github.io/v1/feathers-hooks-common/index.html#Disable}
 */
export function disable(...args: any[]): any;
