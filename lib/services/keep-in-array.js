const errors = require('@feathersjs/errors');
const getByDot = require('lodash/get');
const setByDot = require('lodash/set');
const existsByDot = require('lodash/has');

const getItems = require('./get-items');

module.exports = function (field, fieldNames) {
  return context => {
    const items = getItems(context);

    if (Array.isArray(items)) {
      items.forEach(item => replaceIn(item, field, fieldNames));
    } else {
      replaceIn(items, field, fieldNames);
    }

    return context;
  };
};

function replaceIn (item, field, fieldNames) {
  const target = getByDot(item, field);
  if (target) {
    if (!Array.isArray(target)) throw new errors.BadRequest(`The 'field' param must lead to array. found type '${typeof target}' instead`);

    setByDot(item, field, target.map(item => replaceItem(item, fieldNames)));
  }
}

function replaceItem (item, fields) {
  if (typeof item !== 'object' || item === null) return item;

  const newItem = {};
  fields.forEach(field => {
    if (!existsByDot(item, field)) return;

    const value = getByDot(item, field);
    setByDot(newItem, field, value);
  });
  item = newItem;
  return item;
}
