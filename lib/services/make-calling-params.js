
module.exports = function makeCallingParams (
  context, query, include = ['provider', 'authenticated', 'user'], inject = {}
) {
  const included = query ? { query } : {};

  if (include) {
    (Array.isArray(include) ? include : [include]).forEach(name => {
      if (context.params && name in context.params) included[name] = context.params[name];
    });
  }

  return Object.assign({ _populate: 'skip' }, included, inject);
};
