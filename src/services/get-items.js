
export default function (hook) {
  const items = hook.type === 'before' ? hook.data : hook.result;
  return items && hook.method === 'find' ? items.data || items : items;
}
