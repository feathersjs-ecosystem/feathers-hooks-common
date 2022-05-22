import type { Hook, Query } from '@feathersjs/feathers';
import type { ResolverMap, SyncContextFunction } from '../types';

/**
 * We often want to combine rows from two or more tables based on a relationship between them. The fastJoin hook
 * will select records that have matching values in both tables. It can batch service calls and cache records,
 * thereby needing roughly an order of magnitude fewer database calls than the populate hook, i.e. 2 calls instead
 * of 20. It uses a GraphQL-like imperative API.
 *
 * fastJoin is not restricted to using data from Feathers services. Resources for which there are no Feathers
 * adapters can also be used.
 *
 *
 * fastJoin(postResolvers)
 * fastJoin(postResolvers, query)
 * fastJoin(context => postResolvers)
 * fastJoin(postResolvers, context => query) // supports queries from client
 * {@link https://hooks-common.feathersjs.com/hooks.html#fastjoin}
 */
export function fastJoin (
  resolvers: ResolverMap<any> | SyncContextFunction<ResolverMap<any>>,
  query?: Query | SyncContextFunction<Query>
): Hook {
  return (context: any) => {
    const { method, data, result, params } = context;

    if (params._populate || params._graphql) return context; // our service called within another populate

    const q = typeof query === 'function' ? query(context) : query;
    const joins2 = typeof resolvers === 'function' ? resolvers(context) : resolvers;
    const { before, joins, after } = joins2;

    const temp = result || (Array.isArray(data) ? data : [data]);
    const results = method === 'find' ? result.data || temp : temp;

    const prevLoaders = context._loaders;
    context._loaders = {};

    return Promise.resolve()
      .then(() => before && before(context))
      .then(() => joins && results && recursive(joinsForQuery(joins2, q, context), results, context))
      .then(() => after && after(context))
      .then(() => {
        context._loaders = prevLoaders;
        return context;
      });
  };
}

function joinsForQuery ({
  joins
}: any = {}, query: any = undefined, context = {}) {
  const runtime: any = [];

  Object.keys(joins).forEach(outerLabel => {
    if (query && !query[outerLabel]) return;

    let join = joins[outerLabel];
    if (typeof join === 'function') {
      join = { resolver: join };
    }

    const { resolver } = join;
    let { joins: innerJoins } = join;
    if (innerJoins && !innerJoins.resolver && innerJoins.joins) { // support embedded resolvers for other services
      innerJoins = innerJoins.joins;
    }

    let args: any = query ? query[outerLabel] : [];
    if (!Array.isArray(args)) {
      args = typeof args === 'object' && args !== null ? args.args : [];
    }

    runtime.push({
      args,
      resolver,
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
            if (!addedResults || !joins) return context;

            return recursive(joins, addedResults, context);
          });
      }
    ))
  ));
}
