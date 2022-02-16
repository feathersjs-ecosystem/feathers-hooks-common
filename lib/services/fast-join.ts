
module.exports = function fastJoin (joins1: any, query1: any) {
  return (context: any) => {
    const { method, data, result, params } = context;

    if (params._populate || params._graphql) return; // our service called within another populate

    const query = typeof query1 === 'function' ? query1(context) : query1;
    const joins2 = typeof joins1 === 'function' ? joins1(context) : joins1;
    const { before, joins, after } = joins2;

    const temp = result || (Array.isArray(data) ? data : [data]);
    const results = method === 'find' ? result.data || temp : temp;

    const prevLoaders = context._loaders;
    context._loaders = {};

    return Promise.resolve()
      .then(() => before && before(context))
      .then(() => joins && results && recursive(joinsForQuery(joins2, query, context), results, context))
      .then(() => after && after(context))
      .then(() => {
        context._loaders = prevLoaders;
        return context;
      });
  };
};

function joinsForQuery ({
  joins
}: any = {}, query = undefined, context = {}) {
  const runtime: any = [];

  Object.keys(joins).forEach(outerLabel => {
    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    if (query && !query[outerLabel]) return;

    let join = joins[outerLabel];
    if (typeof join === 'function') {
      join = { resolver: join };
    }

    let { resolver, joins: innerJoins } = join;
    if (innerJoins && !innerJoins.resolver && innerJoins.joins) { // support embedded resolvers for other services
      innerJoins = innerJoins.joins;
    }

    // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
    let args = query ? query[outerLabel] : [];
    if (!Array.isArray(args)) {
      args = typeof args === 'object' && args !== null ? args.args : [];
    }

    runtime.push({
      args,
      resolver: resolver,
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      joins: innerJoins ? joinsForQuery({ joins: innerJoins }, query ? query[outerLabel] : null, context) : null
    });
  });

  return runtime;
}

function recursive (joins: any, results: any, context: any) {
  return Promise.all((Array.isArray(results) ? results : [results]).map(
    result => Promise.all(joins.map(
      ({
        args = [],
        resolver,
        joins
      }: any) => {
        return Promise.resolve(resolver(...args)(result, context))
          .then(addedResults => {
            if (!addedResults || !joins) return;

            return recursive(joins, addedResults, context);
          });
      }
    ))
  ));
}
