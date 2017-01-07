
const traverser = require('traverse');

export default function (items /* modified */, converter) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
}
