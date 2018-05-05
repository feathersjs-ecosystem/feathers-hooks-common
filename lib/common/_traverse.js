
const traverser = require('traverse');

module.exports = function (items /* modified */, converter) {
  [].concat(items).forEach(item => {
    traverser(item).forEach(converter); // replacement is in place
  });
};
