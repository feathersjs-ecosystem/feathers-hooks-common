import type { Hook } from '@feathersjs/feathers';
import traverse from 'traverse';
import { checkContext } from '../utils/check-context';

/**
 * Wrap MongoDB foreign keys in ObjectId.
 * {@link https://hooks-common.feathersjs.com/hooks.html#mongokeys}
 */
export function mongoKeys (
  ObjectId: new (id?: string | number) => any,
  keyFields: string | string[]
): Hook {
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

    traverse(query).forEach(function (this: any, node: any) {
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
                const newNode = { $in: wrapValue(node[onlyProp]) };
                this.update(newNode);
              }
            } else if (typeofNode === 'string' || typeofNode === 'number') {
              // { keyPath: '111111111111' }
              const newNode = wrapValue(node);
              this.update(newNode);
            }
          }
        }
      });
    });

    return context;
  };

  function wrapValue (value: any) {
    return Array.isArray(value) ? value.map(val => new ObjectId(val)) : new ObjectId(value);
  }
}
