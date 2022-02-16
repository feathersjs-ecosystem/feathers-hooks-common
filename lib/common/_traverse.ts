
const traverser = require('traverse');

module.exports = function (items: any /* modified */, converter: any) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
};
