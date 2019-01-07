
const getItems = require('./get-items');
const replaceItems = require('./replace-items');

const methodsWithBeforeData = ['create', 'update', 'patch'];
const defaultConversions = {
  boolean: {
    sql: boolean => boolean ? 1 : 0,
    js: numb => !!numb
  },
  date: {
    sql: dateNow => dateNow,
    js: sqlDate => new Date(sqlDate).valueOf() || null
  },
  json: {
    sql: obj => JSON.stringify(obj),
    js: str => JSON.parse(str)
  }
};

module.exports = sequelizeConvert;

function sequelizeConvert (converts, ignores, conversions) {
  const converter = sequelizeConversion(converts, ignores, conversions);

  return context => {
    if (context.type === 'before' && !methodsWithBeforeData.includes(context.method)) return context;

    const items = getItems(context);
    converter(context.type === 'before' ? 'sql' : 'js', items);
    replaceItems(context, items);

    return context;
  };
}

function sequelizeConversion (converts, ignores, conversions = {}) {
  converts = converts || {};
  ignores = ignores || [];
  conversions.boolean = conversions.boolean || defaultConversions.boolean;
  conversions.date = conversions.date || defaultConversions.date;
  conversions.json = conversions.json || defaultConversions.json;

  const props = Object.keys(converts).filter(name => !ignores.includes(name));

  return (sqlJs, recs) => {
    recs = Array.isArray(recs) ? recs : [recs];

    recs.forEach(rec => {
      props.forEach(name => {
        if (name in rec) {
          rec[name] = conversions[converts[name].toLowerCase()][sqlJs](rec[name]);
        }
      });
    });
  };
}
