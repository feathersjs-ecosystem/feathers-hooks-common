
const alterItems = require('./alter-items');

module.exports = function dialablePhoneNumber (libphonenumberJs,
  defaultCountry = 'US', phoneField = 'phone', dialableField = 'dialablePhone', countryField = 'country'
) {
  return context => alterItems(rec => {
    const phone = rec[phoneField];

    if (typeof phone === 'string') {
      const parsedPhoneNumber = libphonenumberJs.parsePhoneNumber(phone, defaultCountry);

      if (dialableField) {
        rec[dialableField] = parsedPhoneNumber.number;
      }

      if (countryField) {
        rec[countryField] = parsedPhoneNumber.country;
      }
    }
  })(context);
};
