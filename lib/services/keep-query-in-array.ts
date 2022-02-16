const checkContext = require('./check-context');
const errors = require('@feathersjs/errors');
const getByDot = require('lodash/get');
const setByDot = require('lodash/set');
const existsByDot = require('lodash/has');

module.exports = function (field, fieldNames) {
  return context => {
    checkContext(context, 'before', null, 'keepQueryInArray');

    replaceIn(context.query, field, fieldNames);

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
