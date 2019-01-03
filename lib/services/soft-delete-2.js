
/*
 How the softDelete2 hook is to be positioned relative to other possible hooks:

 before: {
   // Add { deletedAt: -1 } to params.query.
   find:   [...hooks1, softDelete(), ...hooks2],
   // Add { deletedAt: -1 } to the (array of) data objects.
   // Existing deletedAt props will not be overridden if options.keepOnCreate = true.
   create: [...hooks1, softDelete(), ...hooks2],
   // For update & non-optimized get: throw if record is deleted, else continue.
   // The record is checked with a probing get call. On this probing get call:
   // - before hooks positioned before softDelete will be run.
   // - before hooks positioned after softDelete will not be run.
   // - after hooks will not be run.
   get:    [...hooks1, softDelete(), ...hooks2], // options.skipProbeOnGet: false
   update: [...hooks1, softDelete(), ...hooks2],
   // For optimized get: get record normally.
   // before: softDelete2() is a no-op. after: softDelete2() throws if record is marked deleted.
   get:    [...hooks1, softDelete({ skipProbeOnGet: true }), ...hooks2], // options.skipProbeOnGet: true
   // If context.id provided: throw if record is deleted, else continue.
   // If not provided: add { deletedAt: -1 } to params.query.
   patch:  [...hooks1, softDelete(), ...hooks2],
   // If context.id provided: throw if record is deleted.
   // If not provided: add { deletedAt: -1 } to params.query.
   // Then in both cases: perform a removing patch call. On this removing patch call
   // - before hooks positioned before softDelete will be run.
   // - before hooks positioned after softDelete will not be run.
   // - after hooks will not be run.
   // Then set context.result to the response, so preventing the remove call itself from being made.
   remove: [...hooks1, softDelete()] // Must be the last hook run for remove calls.
 },
 after: {
   // Must be the first hook run for the service so the remaining after hooks may be skipped
   // for the probing get and removing patch calls made by softDelete.
   all: softDelete2(), // Must be the first hook run for get or patch calls.
   // skipProbeOnGet must be provided on both the before and after softDelete2 hooks.
   // The deletedAt option must also be specified on the after hook if its not the default.
   all: softDelete2({ deletedAt: '...', skipProbeOnGet: true }), // If optimized get used.
   // allowIgnoreDeletedAt must be provided on both the before and after hooks.
   all: softDelete2({ allowIgnoreDeletedAt: false })
 }

 The results are unpredictable if
 - Other hooks before softDelete return SKIP.
 - Other hooks anywhere set context.result.

 Semaphores:
 - params.$ignoreDeletedAt
   softDelete2() is a no-op for any call with set to true. This allows you to make service calls
   while ignoring the deletedAt prop. You are then responsible for setting & maintaining deletedAt.
 - params.$disableSoftDelete2
   Set to true for probing get and removing patch service calls made by softDelete().
   Custom replacements functions for these calls must set this as well.
   These types of calls do not run all the get or patch hooks.
 - Calls made on the server can set these param props. Clients cannot without server code allowing
   them to do so. You should not use softDelete if you decide this is a security weakness.
 */

const errors = require('@feathersjs/errors');
const SKIP = require('@feathersjs/feathers').SKIP;
const { callingParams } = require('./calling-params');

const defaultDeletedAt = 'deletedAt';
const deletedMessage = 'Record not found, is logically deleted.';

module.exports = function (options = {}) {
  const keepOnCreate = !!options.keepOnCreate;
  const skipProbeOnGet = !!options.skipProbeOnGet;
  const allowIgnoreDeletedAt = 'allowIgnoreDeletedAt' in options ? !!options.allowIgnoreDeletedAt : true;
  const patchCall = options.patchCall || defaultPatchCall;
  const deletedAt = options.deletedAt || 'deletedAt';

  return async function (context) {
    const method = context.method;
    const hasId = context.id !== undefined && context.id !== null;

    // Sometimes we have to work with all the records, ignoring the deleteAt prop
    if (allowIgnoreDeletedAt && context.params.$ignoreDeletedAt) {
      return context;
    }

    /*
     Used as an after hook
     */

    if (context.type !== 'before') {
      if (context.params.$disableSoftDelete2 && (method === 'get' || method === 'patch')) {
        return SKIP;
      }

      const result = context.result ? context.result.data || context.result : null;
      if (skipProbeOnGet && result && result[deletedAt] >= 0) {
        throw new errors.NotFound(deletedMessage, { id: context.id });
      }

      return context;
    }

    /*
     Used as a before hook
     */

    // This hook often makes a probing `get` to see if a record is marked deleted.
    // It will also make a removing patch call instead of a remove.
    // Skip all hooks, including auth ones, in these 2 cases. The user record is still returned.
    if (context.params.$disableSoftDelete2 && (method === 'get' || method === 'patch')) {
      return SKIP;
    }

    switch (method) {
      case 'find':
        context.params.query = addField(context.params.query, deletedAt, -1);
        return context;
      case 'create':
        const data = context.data;

        context.data = Array.isArray(data)
          ? data.map(rec => addField(rec, deletedAt, -1, keepOnCreate))
          : addField(data, deletedAt, -1, keepOnCreate);

        return context;
      case 'get':
        if (!skipProbeOnGet) {
          await getActiveRecord(options, context);
        }
        return context;
      case 'update':
        await getActiveRecord(options, context);
        return context;
      case 'patch':
        if (hasId) {
          await getActiveRecord(options, context);
          return context;
        }

        context.params.query = addField(context.params.query, deletedAt, -1);
        return context;
      case 'remove':
        if (hasId) {
          await getActiveRecord(options, context);
        } else {
          context.params.query = addField(context.params.query, deletedAt, -1);
        }

        context.result = await patchCall(context, options);
        return context;
    }
  };
};

async function getActiveRecord (options, context) {
  const record = await (options.probeCall || defaultProbeCall)(context, options);

  if (record[options.deletedAt || defaultDeletedAt] > -1) {
    throw new errors.NotFound(deletedMessage, { id: context.id });
  }

  return record;
}

async function defaultProbeCall (context, options) {
  const params = callingParams({
    newProps: { provider: undefined }, hooksToDisable: ['softDelete2']
  })(context);

  return context.service.get(context.id, params);
}

async function defaultPatchCall (context, options) {
  const deletedAt = options.deletedAt || defaultDeletedAt;

  const params = callingParams({
    query: Object.assign({}, context.params.query, { [deletedAt]: -1 }),
    newProps: { provider: undefined },
    hooksToDisable: ['softDelete2']
  })(context);

  return context.service.patch(context.id, { [deletedAt]: Date.now() }, params);
}

function addField (obj = {}, name, value, keep) {
  return (name in obj) && keep ? obj : Object.assign({}, obj, { [name]: value });
}
