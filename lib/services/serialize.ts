// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getByDot'.
const getByDot = require('lodash/get');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

module.exports = function (schema1: any) {
  return (context: any) => {
    const schema = typeof schema1 === 'function' ? schema1(context) : schema1;
    const schemaDirectives = ['computed', 'exclude', 'only'];

    replaceItems(context, serializeItems(getItems(context), schema));
    return context;

    function serializeItems (items: any, schema: any) {
      if (!Array.isArray(items)) {
        return serializeItem(items, schema);
      }

      return items.map(item => serializeItem(item, schema));
    }

    function serializeItem (item: any, schema: any) {
      const computed = {};
      Object.keys(schema.computed || {}).forEach(name => {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        computed[name] = schema.computed[name](item, context); // needs closure
      });

      let only = schema.only;
      only = typeof only === 'string' ? [only] : only;
      if (only) {
        const newItem = {};
        only.concat('_include', '_elapsed', item._include || []).forEach((key: any) => {
          const value = getByDot(item, key);
          if (value !== undefined) {
            setByDot(newItem, key, value);
          }
        });
        item = newItem;
      }

      let exclude = schema.exclude;
      exclude = typeof exclude === 'string' ? [exclude] : exclude;
      if (exclude) {
        item = omit(item, exclude);
      }

      const _computed = Object.keys(computed);
      item = Object.assign({}, item, computed, _computed.length ? { _computed } : {});

      Object.keys(schema).forEach(key => {
        if (!schemaDirectives.includes(key) && typeof item[key] === 'object') { // needs closure
          item[key] = serializeItems(item[key], schema[key]);
        }
      });

      return item;
    }
  };
};
