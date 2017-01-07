
import getByDot from './get-by-dot';

// transformer(item /* modified */, fieldName, value)
export default function (items /* modified */, fieldNames, transformer) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach(fieldName => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
}
