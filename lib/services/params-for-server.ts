
module.exports = function (params1 = {}, ...whitelist: any[]) {
  const ifWhitelist = !!whitelist.length;
  const params = Object.assign({}, params1);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type '{}'.
  params.query = params.query || {};
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type '{}'.
  params.query.$client = params.query.$client || {};

  Object.keys(params).forEach(key => {
    if (key !== 'query') {
      if (!ifWhitelist || whitelist.includes(key)) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'query' does not exist on type '{}'.
        params.query.$client[key] = params[key];
      }

      // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      delete params[key];
    }
  });

  return params;
};
