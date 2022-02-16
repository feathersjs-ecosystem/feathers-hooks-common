
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getByDot'.
const getByDot = require('lodash/get');

module.exports = function (items: any /* modified */, fieldNames: any, transformer: any) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach((fieldName: any) => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
};
