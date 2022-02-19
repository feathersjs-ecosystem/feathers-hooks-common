import traverser from 'traverse';

export default function (items: any /* modified */, converter: any) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
}
