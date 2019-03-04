
/**
 * Used to run a predicate function and cast it to a promise. Optionally pass in the value to use for "this" if it's a function
 * and an array of arguments to use for the function.
 *
 * This will accept the following types as the predicate value
 * 1. A function
 *   - The function will be called with `apply`
 *   - The second argument `that` will be bound to the `this` value of the function
 *   - The third argument is an array of arguments to pass into the function
 *   - The result of the predicate will be cast to a boolean value
 *   - The result of the function can also be a Promise, which will be handled the same as passing a promise as the predicate
 * 2. A promise (for example another predicate)
 * 3. Any other value, either truthy or falsy
 *
 * Regardless of what type is passed in it is cast to a boolean (i.e. !!result)
 */
module.exports = function (predicate, that, args) {
  const isFunction = typeof predicate === 'function';
  return Promise.resolve(isFunction ? predicate.apply(that, args) : predicate)
    // Wait for the value, which could be a promise
    .then(result => !!result);
  // todo: should we catch errors and return false??
};
