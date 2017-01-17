
import errors from 'feathers-errors';

import getByDot from '../common/get-by-dot';
import getItems from './get-items';
import legacyPopulate from './legacy-populate';
import replaceItems from './replace-items';

export default function (options, ...rest) {
  if (typeof options === 'string') {
    return legacyPopulate(options, ...rest);
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

        if (typeof checkPermissions !== 'function') {
          throw new errors.BadRequest('Permissions param is not a function. (populate)');
        }

        if (permissions && !checkPermissions(hook, hook.path, permissions, 0)) {
          throw new errors.BadRequest('Permissions do not allow this populate. (populate)');
        }

        if (typeof schema1 !== 'object') {
          throw new errors.BadRequest('Schema does not resolve to an object. (populate)');
        }

        const include = [].concat(schema1.include || []);
        return !include.length ? items : populateItemArray(options1, hook, items, include, 0);
      })
      .then(items => {
        replaceItems(hook, items);
        return hook;
      });
  };
}

function populateItemArray (options, hook, items, includeSchema, depth) {
  // 'items' is an item or an array of items
  // 'includeSchema' is like [ { nameAs: 'author', ... }, { nameAs: 'readers', ... } ]

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
  item._include = [];

  return Promise.all(
    include.map(childSchema => {
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
      // 'children' is like [{ authorInfo: {...}, readersInfo: [{...}, {...}] }]
      if (options.profile !== false) {
        elapsed.total = getElapsed(options, startAtAllIncludes, depth);
        item._elapsed = elapsed;
      }

      return Object.assign(item, ...children);
    });
}

function populateAddChild (options, hook, parentItem, childSchema, depth) {
  /*
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
      include: [ ... ],
    }
  */

  // note: parentField & childField are req'd, plus parentItem[parentField} !== undefined .
  // childSchema.select may override their relationship but some relationship must be given.
  if (!childSchema.service || !childSchema.parentField || !childSchema.childField) {
    throw new errors.BadRequest('Child schema is missing a required property. (populate)');
  }

  if (childSchema.permissions &&
    !options.checkPermissions(hook, childSchema.service, childSchema.permissions, depth)
  ) {
    throw new errors.BadRequest(
      `Permissions for ${childSchema.service} do not allow include. (populate)`
    );
  }

  const nameAs = childSchema.nameAs || childSchema.service;
  parentItem._include.push(nameAs);

  let promise = Promise.resolve()
    .then(() => (childSchema.select ? childSchema.select(hook, parentItem, depth) : {}))
    .then(selectQuery => {
      const parentVal = getByDot(parentItem, childSchema.parentField);

      if (parentVal === undefined) {
        throw new errors.BadRequest(
          `ParentField ${childSchema.parentField} for ${nameAs} depth ${depth} is undefined. (populate)`
        );
      }

      const query = Object.assign({},
        childSchema.query,
        { [childSchema.childField]: Array.isArray(parentVal) ? { $in: parentVal } : parentVal },
        selectQuery // dynamic options override static ones
      );

      const serviceHandle = hook.app.service(childSchema.service);

      if (!serviceHandle) {
        throw new errors.BadRequest(`Service ${childSchema.service} is not configured. (populate)`);
      }

      const paginate = 'paginate' in childSchema ? childSchema.paginate : false;

      const params = Object.assign({}, hook.params, { query, paginate, _populate: 'skip' });
      return serviceHandle.find(params);
    })
    .then(result => {
      result = result.data || result;

      if (result.length === 1 && !childSchema.asArray) {
        result = result[0];
      }

      return result;
    });

  if (childSchema.include) {
    promise = promise
      .then(items => populateItemArray(options, hook, items, childSchema.include, depth));
  }

  return promise
    .then(items => ({ [nameAs]: items }));
}

// Helpers

function getElapsed (options, startHrtime, depth) {
  if (options.profile === true) {
    const elapsed = process.hrtime(startHrtime);
    return elapsed[0] * 1e9 + elapsed[1];
  } else if (options.profile !== false) {
    return depth; // for testing _elapsed
  }
}
