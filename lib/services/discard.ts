const omit = require('lodash/omit');

const checkContextIf = require('./check-context-if');
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

module.exports = function (...fieldNames) {
  return context => {
    checkContextIf(context, 'before', ['create', 'update', 'patch'], 'discard');

    const items = getItems(context);
    const convert = item => omit(item, fieldNames);
    const converted = Array.isArray(items) ? items.map(convert) : convert(items);

    replaceItems(context, converted);

    return context;
  };
};
