
module.exports = function (...rest: any[]) {
  return function(this: any, ...fnArgs: any[]) {
    const promises = rest.map(fn => fn.apply(this, fnArgs));

    return Promise.all(promises).then(results => {
      return Promise.resolve(results.every(result => !!result));
    });
  };
};
