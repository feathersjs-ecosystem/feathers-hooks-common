
const errors = require('@feathersjs/errors');
const getByDot = require('../common/get-by-dot');
const setByDot = require('../common/set-by-dot');
const getItems = require('./get-items');
const legacyPopulate = require('./legacy-populate');
const replaceItems = require('./replace-items');

module.exports = function (options, ...rest) {
  // options.schema is like { service: '...', permissions: '...', include: [ ... ] }
  options = options || {};

  if (typeof options === 'string') {
    return legacyPopulate(options, ...rest);
  }

  const typeofSchema = typeof options.schema;
  if ((typeofSchema !== 'object' || options.schema === null) && typeofSchema !== 'function') {
    throw new Error('Options.schema is not an object. (populate)');
  }

  return function (hook) {
    const optionsDefault = {
      schema: {},
      checkPermissions: () => true,
      profile: false
    };

    if (hook.params._populate === 'skip') { // this service call made from another populate
      return hook;
    }

    return Promise.resolve()
      .then(() => {
        // 'options.schema' resolves to { permissions: '...', include: [ ... ] }

        const items = getItems(hook);
        const options1 = Object.assign({}, optionsDefault, options);
        const { schema, checkPermissions } = options1;
        const schema1 = typeof schema === 'function' ? schema(hook, options1) : schema;
        const permissions = schema1.permissions || null;
        const baseService = schema1.service;
        const provider = ('provider' in schema1) ? schema1.provider : hook.params.provider;

        if (typeof checkPermissions !== 'function') {
          throw new errors.BadRequest('Permissions param is not a function. (populate)');
        }

        if (baseService && hook.path && baseService !== hook.path) {
          throw new errors.BadRequest(`Schema is for ${baseService} not ${hook.path}. (populate)`);
        }

        if (permissions && !checkPermissions(hook, hook.path, permissions, 0)) {
          throw new errors.BadRequest('Permissions do not allow this populate. (populate)');
        }

        if (typeof schema1 !== 'object') {
          throw new errors.BadRequest('Schema does not resolve to an object. (populate)');
        }

        const include = []
          .concat(schema1.include || [])
          .map(schema => {
            if ('provider' in schema) {
              return schema;
            } else {
              schema.provider = provider;
              return schema;
            }
          });

        return !include.length ? items : populateItemArray(options1, hook, items, include, 0);
      })
      .then(items => {
        replaceItems(hook, items);
        return hook;
      });
  };
};

function populateItemArray (options, hook, items, includeSchema, depth) {
  // 'items' is an item or an array of items
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

  if (items.toJSON || items.toObject) {
    throw new errors.BadRequest('Populate requires results to be plain JavaScript objects. (populate)');
  }

  if (!Array.isArray(items)) {
    return populateItem(options, hook, items, includeSchema, depth + 1);
  }

  return Promise.all(
    items.map(item => populateItem(options, hook, item, includeSchema, depth + 1))
  );
}

function populateItem (options, hook, item, includeSchema, depth) {
  // 'item' is one item
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

  const elapsed = {};
  const startAtAllIncludes = process.hrtime();
  const include = [].concat(includeSchema || []);
  if (!Object.prototype.hasOwnProperty.call(item, '_include')) item._include = [];

  return Promise.all(
    include.map(childSchema => {
      const { query, select, parentField } = childSchema;

      // A related column join is required if neither the query nor select options are provided.
      // That requires item[parentField] exist. (The DB handles child[childField] existence.)
      if (!query && !select && (!parentField || getByDot(item, parentField) === undefined)) {
        return undefined;
      }

      const startAtThisInclude = process.hrtime();
      return populateAddChild(options, hook, item, childSchema, depth)
        .then(result => {
          const nameAs = childSchema.nameAs || childSchema.service;
          elapsed[nameAs] = getElapsed(options, startAtThisInclude, depth);

          return result;
        });
    })
  )
    .then(children => {
      // 'children' is like
      //   [{ nameAs: 'authorInfo', items: {...} }, { nameAs: readersInfo, items: [{...}, {...}] }]
      if (options.profile !== false) {
        elapsed.total = getElapsed(options, startAtAllIncludes, depth);
        item._elapsed = elapsed;
      }

      children.forEach(child => {
        if (child) {
          setByDot(item, child.nameAs, child.items);
        }
      });

      return item;
    });
}

function populateAddChild (options, hook, parentItem, childSchema, depth) {
  /*
  @params
    'parentItem' is the item we are adding children to
    'childSchema' is like
      { service: 'comments',
        permissions: '...',
        nameAs: 'comments',
        asArray: true,
        parentField: 'id',
        childField: 'postId',
        query: { $limit: 5, $select: ['title', 'content', 'postId'], $sort: { createdAt: -1 } },
        select: (hook, parent, depth) => ({ something: { $exists: false }}),
        paginate: false,
        provider: hook.provider,
        useInnerPopulate: false,
        include: [ ... ] }
  @returns { nameAs: string, items: array }
  */

  const {
    childField, paginate, parentField, permissions, query, select, service, useInnerPopulate, provider
  } = childSchema;

  if (!service) {
    throw new errors.BadRequest('Child schema is missing the service property. (populate)');
  }

  // A related column join is required if neither the query nor select options are provided.
  if (!query && !select && !(parentField && childField)) {
    throw new errors.BadRequest('Child schema is missing parentField or childField property. (populate)');
  }

  if (permissions && !options.checkPermissions(hook, service, permissions, depth)) {
    throw new errors.BadRequest(
      `Permissions for ${service} do not allow include. (populate)`
    );
  }

  const nameAs = childSchema.nameAs || service;
  if (parentItem._include.indexOf(nameAs) === -1) parentItem._include.push(nameAs);

  return Promise.resolve()
    .then(() => (select ? select(hook, parentItem, depth) : {}))
    .then(selectQuery => {
      let sqlQuery = {};

      if (parentField) {
        const parentVal = getByDot(parentItem, parentField); // will not be undefined
        sqlQuery = { [childField]: Array.isArray(parentVal) ? { $in: parentVal } : parentVal };
      }

      const queryObj = Object.assign({},
        query,
        sqlQuery,
        selectQuery // dynamic options override static ones
      );

      const serviceHandle = hook.app.service(service);

      if (!serviceHandle) {
        throw new errors.BadRequest(`Service ${service} is not configured. (populate)`);
      }

      let paginateObj = { paginate: false };
      const paginateOption = paginate;
      if (paginateOption === true) { paginateObj = null; }
      if (typeof paginateOption === 'number') {
        paginateObj = { paginate: { default: paginateOption } };
      }

      const params = Object.assign({},
        hook.params,
        paginateObj,
        { query: queryObj },
        useInnerPopulate ? {} : { _populate: 'skip' },
        ('provider' in childSchema) ? { provider: childSchema.provider } : {}
      );

      return serviceHandle.find(params);
    })
    .then(result => {
      result = result.data || result;

      if (result.length === 0) {
        return childSchema.asArray ? [] : null;
      }

      if (result.length === 1 && !childSchema.asArray) {
        result = result[0];
      }

      const include = []
        .concat(childSchema.include || [])
        .map(schema => {
          if ('provider' in schema) {
            return schema;
          } else {
            schema.provider = provider;
            return schema;
          }
        });

      return (childSchema.include && result)
        ? populateItemArray(options, hook, result, include, depth) : result;
    })
    .then(items => ({ nameAs, items }));
}

// Helpers

function getElapsed (options, startHrtime, depth) {
  if (options.profile === true) {
    const elapsed = process.hrtime(startHrtime);
    return (elapsed[0] * 1e9) + elapsed[1];
  } else if (options.profile !== false) {
    return depth; // for testing _elapsed
  }
}
