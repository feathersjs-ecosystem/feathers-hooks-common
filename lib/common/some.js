const multiPredicate = require('./_multiPredicate');

module.exports = multiPredicate(results => results.some(result => !!result));
