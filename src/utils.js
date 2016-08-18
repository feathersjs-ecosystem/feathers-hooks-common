
/* eslint no-param-reassign: 0 */

/**
 * Get a value from an object using dot notation, e.g. employee.address.city
 *
 * @param {Object} obj - The object containing the value
 * @param {string} path - The path to the value, e.g. employee.address.city
 * @returns {*} The value, or undefined if the path does not exist
 *
 * There is no way to differentiate between non-existent paths and a value of undefined
 */
export const getByDot = (obj, path) => path.split('.').reduce(
  (obj1, part) => (typeof obj1 === 'object' ? obj1[part] : undefined),
  obj
);

/**
 * Set a value in an object using dot notation, e.g. employee.address.city.
 *
 * @param {Object} obj - The object
 * @param {string} path - The path where to place the value, e.g. employee.address.city
 * @param {*} value - The value.
 * @param {boolean} ifDelete - Delete the prop at path if value is undefined.
 * @returns {Object} The modified object.
 *
 * To delete a prop, set value = undefined and ifDelete = true. Note that
 * new empty inner objects will still be created,
 * e.g. setByDot({}, 'a.b.c', undefined, true) will return {a: b: {} )
 */
export const setByDot = (obj, path, value, ifDelete) => {
  const parts = path.split('.');
  const lastIndex = parts.length - 1;
  return parts.reduce(
    (obj1, part, i) => {
      if (i !== lastIndex) {
        if (!obj1.hasOwnProperty(part) || typeof obj1[part] !== 'object') {
          obj1[part] = {};
        }
        return obj1[part];
      }

      obj1[part] = value;
      if (value === undefined && ifDelete) {
        delete obj1[part];
      }
      return obj1;
    },
    obj
  );
};
