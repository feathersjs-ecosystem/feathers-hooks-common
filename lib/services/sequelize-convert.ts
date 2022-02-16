
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'getItems'.
const getItems = require('./get-items');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'replaceIte... Remove this comment to see the full error message
const replaceItems = require('./replace-items');

const methodsWithBeforeData = ['create', 'update', 'patch'];
const defaultConversions = {
  boolean: {
    sql: (boolean: any) => boolean ? 1 : 0,
    js: (numb: any) => !!numb
  },
  date: {
    sql: (dateNow: any) => dateNow,
    js: (sqlDate: any) => new Date(sqlDate).valueOf() || null
  },
  json: {
    sql: (obj: any) => JSON.stringify(obj),
    js: (str: any) => JSON.parse(str)
  }
};

module.exports = sequelizeConvert;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sequelizeC... Remove this comment to see the full error message
function sequelizeConvert (converts: any, ignores: any, conversions: any) {
  const converter = sequelizeConversion(converts, ignores, conversions);

  return (context: any) => {
    if (context.type === 'before' && !methodsWithBeforeData.includes(context.method)) return context;

    const items = getItems(context);
    converter(context.type === 'before' ? 'sql' : 'js', items);
    replaceItems(context, items);

    return context;
  };
}

function sequelizeConversion (converts: any, ignores: any, conversions = {}) {
  converts = converts || {};
  ignores = ignores || [];
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'boolean' does not exist on type '{}'.
  conversions.boolean = conversions.boolean || defaultConversions.boolean;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'date' does not exist on type '{}'.
  conversions.date = conversions.date || defaultConversions.date;
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'json' does not exist on type '{}'.
  conversions.json = conversions.json || defaultConversions.json;

  const props = Object.keys(converts).filter(name => !ignores.includes(name));

  return (sqlJs: any, recs: any) => {
    recs = Array.isArray(recs) ? recs : [recs];

    recs.forEach((rec: any) => {
      props.forEach(name => {
        if (name in rec) {
          // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
          rec[name] = conversions[converts[name].toLowerCase()][sqlJs](rec[name]);
        }
      });
    });
  };
}
