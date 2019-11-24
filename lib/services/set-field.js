const get = require('lodash/get');
const setWith = require('lodash/setWith');
const clone = require('lodash/clone');
const _debug = require('debug');
const checkContext = require('./check-context');
const { Forbidden } = require('@feathersjs/errors');

const debug = _debug('feathers-authentication-hooks/setField');

module.exports = ({ as, from, allowUndefined = false }) => {
  if (!as || !from) {
    throw new Error('\'as\' and \'from\' options have to be set');
  }

  return async context => {
    const { params, app } = context;

    if (app.version < '4.0.0') {
      throw new Error('The \'setField\' hook only works with Feathers 4 and the latest database adapters');
    }

    checkContext(context, 'before', null, 'setField');

    const value = get(context, from);

    if (value === undefined) {
      if (!params.provider || allowUndefined) {
        debug(`Skipping call with value ${from} not set`);
        return context;
      }

      throw new Forbidden(`Expected field ${as} not available`);
    }

    debug(`Setting value '${value}' from '${from}' as '${as}'`);

    return setWith(context, as, value, clone);
  };
};
