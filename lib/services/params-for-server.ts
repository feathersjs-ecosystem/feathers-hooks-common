
module.exports = function (params1 = {}, ...whitelist) {
  const ifWhitelist = !!whitelist.length;
  const params = Object.assign({}, params1);

  params.query = params.query || {};
  params.query.$client = params.query.$client || {};

  Object.keys(params).forEach(key => {
    if (key !== 'query') {
      if (!ifWhitelist || whitelist.includes(key)) {
        params.query.$client[key] = params[key];
      }

      delete params[key];
    }
  });

  return params;
};
