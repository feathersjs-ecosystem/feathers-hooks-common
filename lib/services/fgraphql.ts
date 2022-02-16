
const makeDebug = require('debug');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

const debug = makeDebug('fgraphql');
const graphqlActions = ['Query', 'Mutation', 'Subscription'];

module.exports = function fgraphql (options1 = {}) {
  debug('init call');
  const { parse, recordType, resolvers, runTime } = options1;
  let { schema, query: query1 } = options1;

  let ourResolvers; // will be initialized when hook is first called

  const options = Object.assign({}, {
    skipHookWhen: context => !!(context.params || {}).graphql,
    inclAllFieldsServer: true,
    inclAllFieldsClient: true,
    inclAllFields: null, // Will be initialized each hook call.
    inclJoinedNames: true,
    extraAuthProps: []
  }, options1.options || {});

  schema = isFunction(schema) ? schema() : schema;

  if (!isObject(schema) && !isString(schema)) {
    throwError(`Resolved schema is typeof ${typeof schema} rather than string or object. (fgraphql)`, 101);
  }

  if (!isObject(runTime)) {
    throwError(`option runTime is typeof ${typeof runTime} rather than an object. (fgraphql)`, 106);
  }

  if (!isString(recordType)) {
    throwError(`recordType is typeof ${typeof recordType} rather than string. (fgraphql)`, 103);
  }

  if (!isArray(options.extraAuthProps)) {
    throwError(`option extraAuthProps is typeof ${typeof options.extraAuthProps} rather than array. (fgraphql)`, 105);
  }

  const feathersSdl = isObject(schema) ? schema : convertSdlToFeathersSchemaObject(schema, parse);
  debug('schema now in internal form');

  // Return the hook.
  return context => {
    const contextParams = context.params;
    const optSkipHookWhen = options.skipHookWhen;
    const skipHookWhen = isFunction(optSkipHookWhen) ? optSkipHookWhen(context) : optSkipHookWhen;
    debug(`\n.....hook called. type ${context.type} method ${context.method} resolved skipHookWhen ${skipHookWhen}`);

    if (context.params.$populate) return context; // populate or fastJoin are running
    if (skipHookWhen) return context;

    const query = isFunction(query1) ? query1(context) : query1;

    if (!isObject(query)) {
      throwError(`Resolved query is typeof ${typeof query} rather than object. (fgraphql)`, 102);
    }

    if (!ourResolvers) {
      ourResolvers = resolvers(context.app, runTime);
      debug(`ourResolvers has Types ${Object.keys(ourResolvers)}`);
    }

    if (!ourResolvers[recordType]) {
      throwError(`recordType ${recordType} not found in resolvers. (fgraphql)`, 104);
    }

    options.inclAllFields = contextParams.provider
      ? options.inclAllFieldsClient
      : options.inclAllFieldsServer;
    debug(`inclAllField ${options.inclAllFields}`);

    // Build content parameter passed to resolver functions.
    const resolverContent = {
      app: context.app,
      provider: contextParams.provider,
      user: contextParams.user,
      authenticated: contextParams.authenticated,
      batchLoaders: {},
      cache: {}
    };

    (options.extraAuthProps || []).forEach(name => {
      if (name in contextParams && !(name in resolverContent)) {
        resolverContent[name] = contextParams[name];
      }
    });

    // Static values used by fgraphql functions.
    const store = {
      feathersSdl,
      ourResolvers,
      options,
      resolverContent
    };

    // Populate data.
    const recs = getItems(context);

    return processRecords(store, query, recs, recordType)
      .then(() => {
        replaceItems(context, recs);
        return context;
      });
  };
};

// Process records recursively.
function processRecords (store, query, recs, type, depth = 0) {
  if (!recs) return; // Catch no data to populate.

  recs = isArray(recs) ? recs : [recs];
  debug(`\nvvvvvvvvvv enter ${depth}`);
  debug(`processRecords depth ${depth} #recs ${recs.length} Type ${type}`);

  const storeOurResolversType = store.ourResolvers[type];
  if (!isObject(storeOurResolversType)) {
    throwError(`Resolvers for Type ${type} are typeof ${typeof storeOurResolversType} not object. (fgraphql)`, 201);
  }

  if (!isObject(query)) {
    throwError(`query at Type ${type} are typeof ${typeof query} not object. (fgraphql)`, 202);
  }

  return Promise.all(
    recs.map((rec, j) => processRecord(store, query, depth, rec, type, j))
  )
    .then(() => {
      debug(`^^^^^^^^^^ exit ${depth}\n`);
    });
}

// Process the a record.
function processRecord (store, query, depth, rec, type, j) {
  debug(`processRecord rec# ${j} typeof ${typeof rec} Type ${type}`);
  if (!rec) return; // Catch any null values from resolvers.

  const queryPropNames = Object.keys(query);
  const recFieldNamesInQuery = [];
  const joinedNamesInQuery = [];

  // Process every query item.
  return Promise.all(
    queryPropNames.map((fieldName, i) => processRecordQuery(
      store, query, depth, rec, fieldName, type, recFieldNamesInQuery, joinedNamesInQuery, j, i)
    )
  )
    .then(() => {
      // Retain only record fields selected
      debug(`field names found ${recFieldNamesInQuery} joined names ${joinedNamesInQuery}`);
      if (recFieldNamesInQuery.length || !store.options.inclAllFields || queryPropNames.includes('_none')) {
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
function processRecordQuery (
  store, query, depth, rec, fieldName, type,
  recFieldNamesInQuery, joinedNamesInQuery, j, i
) {
  debug(`\nprocessRecordQuery rec# ${j} Type ${type} field# ${i} name ${fieldName}`);

  // One way to include/exclude rec fields is to give their names a falsey value.
  // _args and _none are not record field names but special purpose
  if (query[fieldName] && fieldName !== '_args' && fieldName !== '_none') {
    if (store.ourResolvers[type][fieldName]) {
      joinedNamesInQuery.push(fieldName);
      return processRecordFieldResolver(store, query, depth, rec, fieldName, type);
    } else {
      debug('is not resolver call');
      recFieldNamesInQuery.push(fieldName);
    }
  }
}

// Process a resolver call.
function processRecordFieldResolver (store, query, depth, rec, fieldName, type) {
  debug('is resolver call');
  const ourQuery = store.feathersSdl[type][fieldName];
  const ourResolver = store.ourResolvers[type][fieldName];

  if (!isFunction(ourResolver)) {
    throwError(`Resolver for Type ${type} fieldName ${fieldName} is typeof ${typeof ourResolver} not function. (fgraphql)`, 203);
  }

  const args = isObject(query[fieldName]) ? query[fieldName]._args : undefined;
  debug(`resolver listType ${ourQuery.listType} args ${JSON.stringify(args)}`);

  // Call resolver function.
  return Promise.resolve(ourResolver(rec, args || {}, store.resolverContent))
    .then(async rawResult => {
      debug(`resolver returned typeof ${isArray(rawResult) ? `array #recs ${rawResult.length}` : typeof rawResult}`);

      // Convert rawResult to query requirements.
      const result = convertResolverResult(rawResult, ourQuery, fieldName, type);
      if (isArray(rawResult !== isArray(result) || typeof rawResult !== typeof result)) {
        debug(`.....resolver result converted to typeof ${isArray(result) ? `array #recs ${result.length}` : typeof result}`);
      }
      rec[fieldName] = result;

      const nextType = ourQuery.typeof;
      debug(`Type ${type} fieldName ${fieldName} next Type ${nextType}`);

      // Populate returned records if their query defn has more fields or Types.
      // Ignore resolvers returning base values like string.
      if (store.ourResolvers[nextType] && isObject(query[fieldName])) {
        return processRecords(store, query[fieldName], result, nextType, depth + 1);
      } else {
        debug('no population of results required');
      }
    });
}

// Convert result of resolver function to match query field requirements.
function convertResolverResult (result, ourQuery, fieldName, type) {
  if (result === null || result === undefined) {
    return ourQuery.listType ? [] : null;
  }

  if (ourQuery.listType) {
    if (!isArray(result)) return [result];
  } else if (isArray(result)) {
    if (result.length > 1) {
      throwError(`Query listType true. Resolver for Type ${type} fieldName ${fieldName} result is array len ${result.length} (fgraphql)`, 204);
    }

    return result[0];
  }

  return result;
}

function convertSdlToFeathersSchemaObject (schemaDefinitionLanguage, parse) {
  const graphQLSchemaObj = parse(schemaDefinitionLanguage);
  return convertDocument(graphQLSchemaObj);
}

function convertDocument (ast) {
  const result = {};

  if (ast.kind !== 'Document' || !isArray(ast.definitions)) {
    throw new Error('Not a valid GraphQL Document.');
  }

  ast.definitions.forEach((definition, definitionIndex) => {
    const [objectName, converted] = convertObjectTypeDefinition(definition, definitionIndex);

    if (objectName) {
      result[objectName] = converted;
    }
  });

  return result;
}

function convertObjectTypeDefinition (definition, definitionIndex) {
  const converted = {};

  if (definition.kind !== 'ObjectTypeDefinition' || !isArray(definition.fields)) {
    throw new Error(`Type# ${definitionIndex} is not a valid ObjectTypeDefinition`);
  }

  const objectTypeName = convertName(definition.name, `Type# ${definitionIndex}`);
  if (graphqlActions.includes(objectTypeName)) return [null, null];

  definition.fields.forEach(field => {
    const [fieldName, fieldDefinition] = convertFieldDefinition(field, `Type ${objectTypeName}`);
    converted[fieldName] = fieldDefinition;
  });

  return [objectTypeName, converted];
}

function convertName (nameObj, errDesc) {
  if (!isObject(nameObj) || !isString(nameObj.value)) {
    throw new Error(`${errDesc} does not have a valid name prop.`);
  }

  return nameObj.value;
}

function convertFieldDefinition (field, errDesc) {
  if (field.kind !== 'FieldDefinition' || !isObject(field.type)) {
    throw new Error(`${errDesc} is not a valid ObjectTypeDefinition`);
  }

  const fieldName = convertName(field.name, errDesc);
  const converted = convertFieldDefinitionType(field.type, errDesc);
  converted.inputValues = field.arguments && field.arguments.length !== 0;

  return [fieldName, converted];
}

function convertFieldDefinitionType (fieldDefinitionType, errDesc, converted) {
  converted = converted || { nonNullTypeList: false, listType: false, nonNullTypeField: false, typeof: null };

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

function throwError (msg, code) {
  const err = new Error(msg);
  err.code = code;
  throw err;
}

function isObject (obj) {
  return typeof obj === 'object' && obj !== null;
}

function isString (str) {
  return typeof str === 'string';
}

function isFunction (func) {
  return typeof func === 'function';
}

function isArray (array) {
  return Array.isArray(array);
}
