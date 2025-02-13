import type { Application, HookContext, Query } from '@feathersjs/feathers';
import type { parse, GraphQLFieldResolver } from 'graphql';
import type { SyncContextFunction } from '../../types';
import { getItems, replaceItems } from '../../utils';

export type FGraphQLResolverMapFactory = (app: Application, runtime: any) => FGraphQLResolverMap;

export interface FGraphQLResolverMap {
  [i: string]: {
    [i: string]: GraphQLFieldResolver<any, any>;
  };
  Query: {
    [i: string]: GraphQLFieldResolver<any, any>;
  };
}

export interface FGraphQLOptions<H extends HookContext = HookContext> {
  skipHookWhen?: SyncContextFunction<boolean, H>;
  inclAllFieldsServer?: boolean;
  inclAllFieldsClient?: boolean;
  inclAllFields?: boolean;
  inclJoinedNames?: boolean;
  extraAuthProps?: string[];
}

export interface FGraphQLHookOptions<H extends HookContext = HookContext> {
  recordType: string;
  schema: string;
  resolvers: FGraphQLResolverMap | FGraphQLResolverMapFactory;
  query: Query | SyncContextFunction<Query, H>;
  options?: FGraphQLOptions<H>;
  runTime: any;
  parse: typeof parse;
}

const graphqlActions = ['Query', 'Mutation', 'Subscription'];

/**
 * Generate Graphql Resolvers for services
 * @see https://medium.com/@eddyystop/38faee75dd1
 */
export function fgraphql<H extends HookContext = HookContext>(options1: FGraphQLHookOptions<H>) {
  const { parse, recordType, resolvers, runTime, query } = options1;
  let { schema } = options1;

  let ourResolvers: any; // will be initialized when hook is first called

  const options = {
    skipHookWhen: (context: any) => !!(context.params || {}).graphql,
    inclAllFieldsServer: true,
    inclAllFieldsClient: true,
    inclAllFields: null, // Will be initialized each hook call.
    inclJoinedNames: true,
    extraAuthProps: [],
    ...(options1.options || {}),
  };

  schema = isFunction(schema) ? schema() : schema;

  if (!isObject(schema) && !isString(schema)) {
    throwError(
      `Resolved schema is typeof ${typeof schema} rather than string or object. (fgraphql)`,
      101,
    );
  }

  if (!isObject(runTime)) {
    throwError(`option runTime is typeof ${typeof runTime} rather than an object. (fgraphql)`, 106);
  }

  if (!isString(recordType)) {
    throwError(`recordType is typeof ${typeof recordType} rather than string. (fgraphql)`, 103);
  }

  if (!isArray(options.extraAuthProps)) {
    throwError(
      `option extraAuthProps is typeof ${typeof options.extraAuthProps} rather than array. (fgraphql)`,
      105,
    );
  }

  const feathersSdl = isObject(schema) ? schema : convertSdlToFeathersSchemaObject(schema, parse);

  // Return the hook.
  return (context: H) => {
    const contextParams = context.params;
    const optSkipHookWhen = options.skipHookWhen;
    const skipHookWhen = isFunction(optSkipHookWhen) ? optSkipHookWhen(context) : optSkipHookWhen;

    if (context.params.$populate) return context; // populate or fastJoin are running
    if (skipHookWhen) return context;

    const q = isFunction(query) ? query(context) : query;

    if (!isObject(q)) {
      throwError(`Resolved query is typeof ${typeof q} rather than object. (fgraphql)`, 102);
    }

    if (!ourResolvers) {
      ourResolvers = resolvers(context.app, runTime);
    }

    if (!ourResolvers[recordType]) {
      throwError(`recordType ${recordType} not found in resolvers. (fgraphql)`, 104);
    }

    options.inclAllFields = contextParams.provider
      ? options.inclAllFieldsClient
      : options.inclAllFieldsServer;

    // Build content parameter passed to resolver functions.
    const resolverContent: Record<string, any> = {
      app: context.app,
      provider: contextParams.provider,
      user: contextParams.user,
      authenticated: contextParams.authenticated,
      batchLoaders: {},
      cache: {},
    };

    (options.extraAuthProps || []).forEach((name: any) => {
      if (name in contextParams && !(name in resolverContent)) {
        resolverContent[name] = contextParams[name];
      }
    });

    // Static values used by fgraphql functions.
    const store = {
      feathersSdl,
      ourResolvers,
      options,
      resolverContent,
    };

    // Populate data.
    const recs = getItems(context);

    return processRecords(store, q, recs, recordType).then(() => {
      replaceItems(context, recs);
      return context;
    });
  };
}

// Process records recursively.
function processRecords(store: any, query: any, recs: any, type: any, depth = 0): any {
  if (!recs) return; // Catch no data to populate.

  recs = isArray(recs) ? recs : [recs];

  const storeOurResolversType = store.ourResolvers[type];
  if (!isObject(storeOurResolversType)) {
    throwError(
      `Resolvers for Type ${type} are typeof ${typeof storeOurResolversType} not object. (fgraphql)`,
      201,
    );
  }

  if (!isObject(query)) {
    throwError(`query at Type ${type} are typeof ${typeof query} not object. (fgraphql)`, 202);
  }

  return Promise.all(
    recs.map((rec: any, j: any) => processRecord(store, query, depth, rec, type, j)),
  );
}

// Process the a record.
function processRecord(store: any, query: any, depth: any, rec: any, type: any, j: any): any {
  if (!rec) return; // Catch any null values from resolvers.

  const queryPropNames = Object.keys(query);
  const recFieldNamesInQuery: any = [];
  const joinedNamesInQuery: any = [];

  // Process every query item.
  return Promise.all(
    queryPropNames.map((fieldName, i) =>
      processRecordQuery(
        store,
        query,
        depth,
        rec,
        fieldName,
        type,
        recFieldNamesInQuery,
        joinedNamesInQuery,
        j,
        i,
      ),
    ),
  ).then(() => {
    // Retain only record fields selected
    if (
      recFieldNamesInQuery.length ||
      !store.options.inclAllFields ||
      queryPropNames.includes('_none')
    ) {
      // recs[0] may have been created by [rec] so can't replace array elem
      Object.keys(rec).forEach(key => {
        if (!recFieldNamesInQuery.includes(key) && !joinedNamesInQuery.includes(key)) {
          delete rec[key];
        }
      });
    }

    // Include joined names in record.
    if (store.options.inclJoinedNames && joinedNamesInQuery.length) {
      rec._include = joinedNamesInQuery;
    }
  });
}

// Process one query field for a record.
function processRecordQuery(
  store: any,
  query: any,
  depth: any,
  rec: any,
  fieldName: any,
  type: any,
  recFieldNamesInQuery: any,
  joinedNamesInQuery: any,
  j: any,
  i: any,
): any {
  // One way to include/exclude rec fields is to give their names a falsey value.
  // _args and _none are not record field names but special purpose
  if (query[fieldName] && fieldName !== '_args' && fieldName !== '_none') {
    if (store.ourResolvers[type][fieldName]) {
      joinedNamesInQuery.push(fieldName);
      return processRecordFieldResolver(store, query, depth, rec, fieldName, type);
    } else {
      recFieldNamesInQuery.push(fieldName);
    }
  }
}

// Process a resolver call.
function processRecordFieldResolver(
  store: any,
  query: any,
  depth: any,
  rec: any,
  fieldName: any,
  type: any,
) {
  const ourQuery = store.feathersSdl[type][fieldName];
  const ourResolver = store.ourResolvers[type][fieldName];

  if (!isFunction(ourResolver)) {
    throwError(
      `Resolver for Type ${type} fieldName ${fieldName} is typeof ${typeof ourResolver} not function. (fgraphql)`,
      203,
    );
  }

  const args = isObject(query[fieldName]) ? query[fieldName]._args : undefined;

  // Call resolver function.
  return Promise.resolve(ourResolver(rec, args || {}, store.resolverContent)).then(
    async rawResult => {
      // Convert rawResult to query requirements.
      const result = convertResolverResult(rawResult, ourQuery, fieldName, type);

      rec[fieldName] = result;

      const nextType = ourQuery.typeof;

      // Populate returned records if their query defn has more fields or Types.
      // Ignore resolvers returning base values like string.
      if (store.ourResolvers[nextType] && isObject(query[fieldName])) {
        return processRecords(store, query[fieldName], result, nextType, depth + 1);
      }
    },
  );
}

// Convert result of resolver function to match query field requirements.
function convertResolverResult(result: any, ourQuery: any, fieldName: any, type: any) {
  if (result === null || result === undefined) {
    return ourQuery.listType ? [] : null;
  }

  if (ourQuery.listType) {
    if (!isArray(result)) return [result];
  } else if (isArray(result)) {
    if (result.length > 1) {
      throwError(
        `Query listType true. Resolver for Type ${type} fieldName ${fieldName} result is array len ${result.length} (fgraphql)`,
        204,
      );
    }

    return result[0];
  }

  return result;
}

function convertSdlToFeathersSchemaObject(schemaDefinitionLanguage: any, parse: any) {
  const graphQLSchemaObj = parse(schemaDefinitionLanguage);
  return convertDocument(graphQLSchemaObj);
}

function convertDocument(ast: any) {
  const result: Record<string, any> = {};

  if (ast.kind !== 'Document' || !isArray(ast.definitions)) {
    throw new Error('Not a valid GraphQL Document.');
  }

  ast.definitions.forEach((definition: any, definitionIndex: any) => {
    const [objectName, converted] = convertObjectTypeDefinition(definition, definitionIndex);

    if (objectName) {
      result[objectName] = converted;
    }
  });

  return result;
}

function convertObjectTypeDefinition(definition: any, definitionIndex: any) {
  const converted: Record<string, any> = {};

  if (definition.kind !== 'ObjectTypeDefinition' || !isArray(definition.fields)) {
    throw new Error(`Type# ${definitionIndex} is not a valid ObjectTypeDefinition`);
  }

  const objectTypeName = convertName(definition.name, `Type# ${definitionIndex}`);
  if (graphqlActions.includes(objectTypeName)) return [null, null];

  definition.fields.forEach((field: any) => {
    const [fieldName, fieldDefinition] = convertFieldDefinition(field, `Type ${objectTypeName}`);
    converted[fieldName] = fieldDefinition;
  });

  return [objectTypeName, converted];
}

function convertName(nameObj: any, errDesc?: any) {
  if (!isObject(nameObj) || !isString(nameObj.value)) {
    throw new Error(`${errDesc} does not have a valid name prop.`);
  }

  return nameObj.value;
}

function convertFieldDefinition(field: any, errDesc: any) {
  if (field.kind !== 'FieldDefinition' || !isObject(field.type)) {
    throw new Error(`${errDesc} is not a valid ObjectTypeDefinition`);
  }

  const fieldName = convertName(field.name, errDesc);
  const converted = convertFieldDefinitionType(field.type, errDesc);
  converted.inputValues = field.arguments && field.arguments.length !== 0;

  return [fieldName, converted];
}

function convertFieldDefinitionType(fieldDefinitionType: any, errDesc: any, converted?: any): any {
  converted = converted || {
    nonNullTypeList: false,
    listType: false,
    nonNullTypeField: false,
    typeof: null,
  };

  if (!isObject(fieldDefinitionType)) {
    throw new Error(`${errDesc} is not a valid Fielddefinition "type".`);
  }

  switch (fieldDefinitionType.kind) {
    case 'NamedType':
      converted.typeof = convertName(fieldDefinitionType.name);
      return converted;
    case 'NonNullType':
      if (fieldDefinitionType.type.kind === 'NamedType') {
        converted.nonNullTypeField = true;
      } else {
        converted.nonNullTypeList = true;
      }

      return convertFieldDefinitionType(fieldDefinitionType.type, errDesc, converted);
    case 'ListType':
      converted.listType = true;
      return convertFieldDefinitionType(fieldDefinitionType.type, errDesc, converted);
  }
}

function throwError(msg: any, code: any) {
  const err = new Error(msg);
  err.code = code;
  throw err;
}

function isObject(obj: any) {
  return typeof obj === 'object' && obj !== null;
}

function isString(str: any) {
  return typeof str === 'string';
}

function isFunction(func: any) {
  return typeof func === 'function';
}

function isArray(array: any) {
  return Array.isArray(array);
}
