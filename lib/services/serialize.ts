const getByDot = require('lodash/get');
const setByDot = require('lodash/set');
const omit = require('lodash/omit');

const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (schema1) {
  return context => {
    const schema = typeof schema1 === 'function' ? schema1(context) : schema1;
    const schemaDirectives = ['computed', 'exclude', 'only'];

    replaceItems(context, serializeItems(getItems(context), schema));
    return context;

    function serializeItems (items, schema) {
      if (!Array.isArray(items)) {
        return serializeItem(items, schema);
      }

      return items.map(item => serializeItem(item, schema));
    }

    function serializeItem (item, schema) {
      const computed = {};
      Object.keys(schema.computed || {}).forEach(name => {
        computed[name] = schema.computed[name](item, context); // needs closure
      });

      let only = schema.only;
      only = typeof only === 'string' ? [only] : only;
      if (only) {
        const newItem = {};
        only.concat('_include', '_elapsed', item._include || []).forEach(key => {
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
