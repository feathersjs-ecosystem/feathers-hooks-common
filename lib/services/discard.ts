// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'omit'.
const omit = require('lodash/omit');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContextIf = require('./check-context-if');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

module.exports = function (...fieldNames: any[]) {
  return (context: any) => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'discard');

    const items = getItems(context);
    const convert = (item: any) => omit(item, fieldNames);
    const converted = Array.isArray(items) ? items.map(convert) : convert(items);

    replaceItems(context, converted);

    return context;
  };
};
