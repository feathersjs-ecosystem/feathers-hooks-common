
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'traverse'.
const traverse = require('traverse');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkConte... Remove this comment to see the full error message
const checkContext = require('./check-context');

module.exports = function mongoKeys (ObjectID: any, keyFields: any) {
  keyFields = Array.isArray(keyFields) ? keyFields : [keyFields];
  const keyLeaves: any = [];

  const keysInfo = keyFields.map((field: any) => {
    const fieldNames = field.split('.');
    const leaf = fieldNames.slice(-1)[0];
    keyLeaves.push(leaf);

    return { leaf, len: fieldNames.length, path: JSON.stringify(fieldNames) };
  });

  return (context: any) => {
    checkContext(context, 'before', null, 'mongoKeys');
    const query = context.params.query || {};

    traverse(query).forEach(function(this: any, node: any) {
      const typeofNode = typeof node;
      const key = this.key;
      const path = this.path;

      if (keyLeaves.indexOf(key) === -1) return;
      if (path.indexOf('$sort') !== -1) return;

      keysInfo.forEach((info: any) => {
        if (info.leaf === key && info.len <= path.length) {
          const endPath = path.slice(-info.len);
          if (JSON.stringify(endPath) === info.path) {
            if (typeofNode === 'object' && node !== null && !Array.isArray(node)) {
              // { keyPath: { ... } }
              const actualProps = Object.keys(node);
              const onlyProp = actualProps[0];

              if (actualProps.length === 1 && onlyProp === '$in') {
                // { keyPath: { $in: [...] } }
                // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
                const newNode = { $in: wrapValue(node[onlyProp], true) };
                this.update(newNode);
              }
            } else if (typeofNode === 'string' || typeofNode === 'number') {
              // { keyPath: '111111111111' }
              // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
              const newNode = wrapValue(node, true);
              this.update(newNode);
            }
          }
        }
      });
    });

    return context;
  };

  function wrapValue (value: any) {
    return Array.isArray(value) ? value.map(val => new ObjectID(val)) : new ObjectID(value);
  }
};
