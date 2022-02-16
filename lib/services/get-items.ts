
module.exports = function (context) {
  if (context.params && context.params._actOn === 'dispatch') return context.dispatch;

  const items = context.type === 'before' ? context.data : context.result;
  return items && context.method === 'find' ? items.data || items : items;
};
