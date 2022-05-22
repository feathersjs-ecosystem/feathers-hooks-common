import traverser from 'traverse';

export function traverse <T extends Record<string, any>> (
  items: T | T[],
  converter: (item: T) => void
) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
}
