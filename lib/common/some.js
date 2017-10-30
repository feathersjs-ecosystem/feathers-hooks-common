
module.exports = function (...rest) {
  return function (...fnArgs) {
    const promises = rest.map(fn => fn.apply(this, fnArgs));

    return Promise.all(promises).then(results => {
      return Promise.resolve(results.some(result => !!result));
    });
  };
};
