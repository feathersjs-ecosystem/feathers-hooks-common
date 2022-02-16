// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getByDot'.
const getByDot = require('lodash/get');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'setByDot'.
const setByDot = require('lodash/set');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'existsByDo... Remove this comment to see the full error message
const existsByDot = require('lodash/has');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContextIf = require('./check-context-if');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

module.exports = function (...fieldNames: any[]) {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'keep');
    const items = getItems(context);

    if (Array.isArray(items)) {
      replaceItems(context, items.map(item => replaceItem(item, fieldNames)));
    } else {
      replaceItems(context, replaceItem(items, fieldNames));
    }

    return context;
  };
};

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
