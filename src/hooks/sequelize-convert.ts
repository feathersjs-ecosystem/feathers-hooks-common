import type { Hook } from '@feathersjs/feathers';
import type { SequelizeConversion, SequelizeConverts } from '../types';
import { getItems } from '../utils/get-items';
import { replaceItems } from '../utils/replace-items';

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

/**
 * {@link https://hooks-common.feathersjs.com/hooks.html#sequelizeconvert}
 */
export function sequelizeConvert <C extends { [name: string]: SequelizeConversion }> (
  converts: SequelizeConverts<C> | null | undefined | false,
  ignores?: string[] | null | undefined | false,
  conversions?: C
): Hook {
  const converter = sequelizeConversion(converts, ignores, conversions);

  return (context: any) => {
    if (context.type === 'before' && !methodsWithBeforeData.includes(context.method)) return context;

    const items = getItems(context);
    converter(context.type === 'before' ? 'sql' : 'js', items);
    replaceItems(context, items);

    return context;
  };
}

function sequelizeConversion (converts: any, ignores: any, conversions: Record<string, any> = {}) {
  converts = converts || {};
  ignores = ignores || [];
  conversions.boolean = conversions.boolean || defaultConversions.boolean;
  conversions.date = conversions.date || defaultConversions.date;
  conversions.json = conversions.json || defaultConversions.json;

  const props = Object.keys(converts).filter(name => !ignores.includes(name));

  return (sqlJs: any, recs: any) => {
    recs = Array.isArray(recs) ? recs : [recs];

    recs.forEach((rec: any) => {
      props.forEach(name => {
        if (name in rec) {
          rec[name] = conversions[converts[name].toLowerCase()][sqlJs](rec[name]);
        }
      });
    });
  };
}
