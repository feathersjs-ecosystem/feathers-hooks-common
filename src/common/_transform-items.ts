import getByDot from 'lodash/get';

export default function (items: any /* modified */, fieldNames: any, transformer: any) {
  (Array.isArray(items) ? items : [items]).forEach(item => {
    fieldNames.forEach((fieldName: any) => {
      transformer(item, fieldName, getByDot(item, fieldName));
    });
  });
}
