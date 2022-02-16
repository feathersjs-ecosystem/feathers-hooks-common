
const traverse = require('traverse');
const checkContext = require('./check-context');

module.exports = function mongoKeys (ObjectID, keyFields) {
  keyFields = Array.isArray(keyFields) ? keyFields : [keyFields];
  const keyLeaves = [];

  const keysInfo = keyFields.map(field => {
    const fieldNames = field.split('.');
    const leaf = fieldNames.slice(-1)[0];
    keyLeaves.push(leaf);

    return { leaf, len: fieldNames.length, path: JSON.stringify(fieldNames) };
  });

  return context => {
    checkContext(context, 'before', null, 'mongoKeys');
    const query = context.params.query || {};

    traverse(query).forEach(function (node) {
      const typeofNode = typeof node;
      const key = this.key;
      const path = this.path;

      if (keyLeaves.indexOf(key) === -1) return;
      if (path.indexOf('$sort') !== -1) return;

      keysInfo.forEach(info => {
        if (info.leaf === key && info.len <= path.length) {
          const endPath = path.slice(-info.len);
          if (JSON.stringify(endPath) === info.path) {
            if (typeofNode === 'object' && node !== null && !Array.isArray(node)) {
              // { keyPath: { ... } }
              const actualProps = Object.keys(node);
              const onlyProp = actualProps[0];

              if (actualProps.length === 1 && onlyProp === '$in') {
                // { keyPath: { $in: [...] } }
                const newNode = { $in: wrapValue(node[onlyProp], true) };
                this.update(newNode);
              }
            } else if (typeofNode === 'string' || typeofNode === 'number') {
              // { keyPath: '111111111111' }
              const newNode = wrapValue(node, true);
              this.update(newNode);
            }
          }
        }
      });
    });

    return context;
  };

  function wrapValue (value) {
    return Array.isArray(value) ? value.map(val => new ObjectID(val)) : new ObjectID(value);
  }
};
