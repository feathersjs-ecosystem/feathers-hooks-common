
const alterItems = require('./alter-items');

module.exports = function dialablePhoneNumber (libphonenumberJs, defaultCountry = 'US', phoneField = 'phone', dailableField = 'dialablePhone') {
  return alterItems((item, context) => {
    if (typeof item[phoneField] === 'string') {
      const code = typeof defaultCountry === 'function' ? defaultCountry(item, context) : defaultCountry;

      item[dailableField] = libphonenumberJs.parsePhoneNumber(item[phoneField], code);
    }
  });
};
