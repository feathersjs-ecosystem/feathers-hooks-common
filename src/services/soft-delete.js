import { NotFound } from 'feathers-errors';
import checkContext from './check-context';

/******************************************************************************/
// Data
/******************************************************************************/

const DEFAULTS = {
  field: 'deleted',
  setDeleted: () => true
};

const SKIP = '$disableSoftDelete';

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

async function throwIfDeleted (hook, { field }) {
  const { service, id, method, app } = hook;

  const auth = app.get('auth');
  const entity = (auth && auth.entity) || 'user';

  const params = method === 'get'
  ? hook.params
  : {
    query: {},
    provider: hook.params.provider,
    authenticated: hook.params.authenticated,
    [entity]: hook.params[entity],
    _populate: 'skip'
  };

  params.query[SKIP] = true;

  const doc = await service.get(id, params);

  delete params.query[SKIP];

  if (doc[field]) {
    throw new NotFound(`Record for id '${id}' has been soft deleted.`);
  }

  return doc;
}

/******************************************************************************/
// Export
/******************************************************************************/

export default function (config) {
  const opt = validate(config);

  return async function (hook) {
    checkContext(hook, 'before', null, 'softDelete');

    const { method, service } = hook;

    hook.params.query = hook.params.query || {};

    if (hook.params.query[SKIP]) {
      delete hook.params.query[SKIP];
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
        hook.params.query[SKIP] = true;

        hook.result = await service.patch(hook.id, hook.data, hook.params);

        break;

      case 'create':
      // No soft deleting needs to happen on reate
        break;
    }

    return hook;
  };
}
