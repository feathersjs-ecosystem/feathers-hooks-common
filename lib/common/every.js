const multiPredicate = require('./_multiPredicate');

module.exports = multiPredicate(results => results.every(result => !!result));