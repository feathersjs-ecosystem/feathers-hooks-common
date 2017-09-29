import { NotFound } from 'feathers-errors';
import checkContext from './check-context';

/******************************************************************************/
// Data
/******************************************************************************/

const DEFAULTS = {
  field: 'deleted',
  disableParam: '$disableSoftDelete',
  allowClientDisable: true,
  setDeleted: () => true
};

const NOT_DELETED = { $in: [ false, null, undefined ] };

/******************************************************************************/
// Helpers
/******************************************************************************/

function validate (config) {
  if (config && typeof config === 'string') { // no blank strings
    config = { field: config };
  }

  if (!config || typeof config !== 'object') {
    config = { };
  }

  const options = Object.assign({}, DEFAULTS, config);
  if (typeof options.setDeleted !== 'function') {
    throw new Error('config.setDeleted must be a function.');
  }

  return options;
}

async function throwIfDeleted (hook, { field, disableParam }) {
  const { service, id, method, app, params } = hook;

  const auth = app.get('auth');
  const entity = (auth && auth.entity) || 'user';
  const { provider, authenticated } = params;

  const getParams = Object.assign(
    {},
    method === 'get'
    ? params
    : {
      query: {},
      provider,
      authenticated,
      _populate: 'skip',
      [entity]: params[entity]
    },
    { [disableParam]: true }
  );

  const doc = await service.get(id, getParams);
  if (doc[field]) {
    throw new NotFound(`Record for id '${id}' has been soft deleted.`);
  }

  return doc;
}

function sortParams (params, { allowClientDisable, disableParam }) {
  params.query = params.query || {};

  if (disableParam in params.query && (allowClientDisable || !params.provider)) {
    params[disableParam] = params.query[disableParam];
  }

  delete params.query[disableParam];

  return params;
}

/******************************************************************************/
// Export
/******************************************************************************/

export default function (config) {
  const opt = validate(config);

  return async function (hook) {
    checkContext(hook, 'before', null, 'softDelete');

    const { method, service, params } = hook;

    hook.params = sortParams(params, opt);
    if (hook.params[opt.disableParam]) {
      return hook;
    }

    switch (method) {
      case 'find':
        hook.params.query[opt.field] = NOT_DELETED;
        break;

      case 'get':
        hook.result = await throwIfDeleted(hook, opt);
        break;

      case 'update': // fall through
      case 'patch':
        if (hook.id !== null) {
          await throwIfDeleted(hook, opt);
        }
        hook.params.query[opt.field] = NOT_DELETED;
        break;

      case 'remove':
        if (hook.id) {
          await throwIfDeleted(hook, opt);
        }

        hook.data = hook.data || {};
        hook.data[opt.field] = await opt.setDeleted(hook);
        if (!hook.data[opt.field]) {
          throw new Error('config.setDeleted must return a truthy value.');
        }

        hook.params.query[opt.field] = NOT_DELETED;

        const patchParams = Object.assign({}, hook.params, { [opt.disableParam]: true });

        hook.result = await service.patch(hook.id, hook.data, patchParams);

        break;

      case 'create':
      // No soft deleting needs to happen on reate
        break;
    }

    return hook;
  };
}
