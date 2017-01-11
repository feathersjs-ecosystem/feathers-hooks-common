
export default function (...whitelist) {
  return hook => {
    whitelist = typeof whitelist === 'string' ? [whitelist] : whitelist;
    const params = hook.params;

    if (params && params.query && params.query.$client && typeof params.query.$client === 'object') {
      const client = params.query.$client;

      whitelist.forEach(key => {
        if (key in client) {
          params[key] = client[key];
        }
      });

      delete params.query.$client;
    }

    return hook;
  };
}
