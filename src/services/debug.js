
export default function (msg) {
  return hook => {
    console.log(`* ${msg || ''}\ntype:${hook.type}, method: ${hook.method}`);
    if (hook.data) { console.log('data:', hook.data); }
    if (hook.params && hook.params.query) { console.log('query:', hook.params.query); }
    if (hook.result) { console.log('result:', hook.result); }
    if (hook.error) { console.log('error', hook.error); }
  };
}
