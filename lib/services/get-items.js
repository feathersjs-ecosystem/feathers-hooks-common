
module.exports = function (context) {
  const items = context.type === 'before' ? context.data : context.result;
  return items && context.method === 'find' ? items.data || items : items;
};
