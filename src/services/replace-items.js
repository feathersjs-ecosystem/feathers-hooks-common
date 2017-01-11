
export default function (hook, items) {
  if (hook.type === 'before') {
    hook.data = items;
  } else if (hook.method === 'find' && hook.result && hook.result.data) {
    if (Array.isArray(items)) {
      hook.result.data = items;
      hook.result.total = items.length;
    } else {
      hook.result.data = [items];
      hook.result.total = 1;
    }
  } else {
    hook.result = items;
  }
}
