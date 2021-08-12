
module.exports = function (context, forceArray = false) {
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  let items = context.type === 'before' ? context.data : context.result;
  items = items && context.method === 'find' ? items.data || items : items;
  if (items && forceArray && !Array.isArray(items)) { items = [items]; }
  return items;
};
