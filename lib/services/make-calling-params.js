
module.exports = function makeCallingParams (
  context, query, include = ['provider', 'authenticated', 'user'], inject = {}
) {
  const included = query ? { query } : {};

  if (include) {
    [].concat(include).forEach(name => {
      if (context.params && name in context.params) included[name] = context.params[name];
    });
  }

  return Object.assign({ _populate: 'skip' }, included, inject);
};
