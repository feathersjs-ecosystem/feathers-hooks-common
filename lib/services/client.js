
module.exports = function (...whitelist) {
  console.log('**Deprecated** The client hook will be removed next FeathersJS version. Use paramsFromClient instead.');

  return context => {
    const params = context.params;

    if (params && params.query && params.query.$client && typeof params.query.$client === 'object') {
      const client = params.query.$client;

      whitelist.forEach(key => {
        if (key in client) {
          params[key] = client[key];
        }
      });

      params.query = Object.assign({}, params.query);
      delete params.query.$client;
    }

    return context;
  };
};
