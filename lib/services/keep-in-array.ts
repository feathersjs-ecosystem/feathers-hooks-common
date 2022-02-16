// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'errors'.
const errors = require('@feathersjs/errors');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getByDot'.
const getByDot = require('lodash/get');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'existsByDo... Remove this comment to see the full error message
const existsByDot = require('lodash/has');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');

module.exports = function (field: any, fieldNames: any) {
  return (context: any) => {
    const items = getItems(context);

    if (Array.isArray(items)) {
      items.forEach(item => replaceIn(item, field, fieldNames));
    } else {
      replaceIn(items, field, fieldNames);
    }

    return context;
  };
};

function replaceIn (item: any, field: any, fieldNames: any) {
  const target = getByDot(item, field);
  if (target) {
    if (!Array.isArray(target)) throw new errors.BadRequest(`The 'field' param must lead to array. found type '${typeof target}' instead`);

    setByDot(item, field, target.map(item => replaceItem(item, fieldNames)));
  }
}

function replaceItem (item: any, fields: any) {
  if (typeof item !== 'object' || item === null) return item;

  const newItem = {};
  fields.forEach((field: any) => {
    if (!existsByDot(item, field)) return;

    const value = getByDot(item, field);
    setByDot(newItem, field, value);
  });
  item = newItem;
  return item;
}
