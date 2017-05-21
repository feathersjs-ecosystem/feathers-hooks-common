
export default function (...whitelist) {
  return hook => {
    const params = hook.params;
    
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
    
    return hook;
  };
}
