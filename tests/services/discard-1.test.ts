
const { assert } = require('chai');
const { discard } = require('../../lib/services');

describe('common hook discard', () => {
  describe('removes fields', () => {
    /* eslint-disable */
    const beforeJohn  = () => ({ type: 'before', data:   {  first: 'John',    last: 'Doe' } });
    const beforeUndef = () => ({ type: 'before', data:   {  first: undefined, last: 'Doe' } });
    const beforeNull =  () => ({ type: 'before', data:   {  first: null,      last: 'Doe' } });
    const afterJane =   () => ({ type: 'after',  result: {  first: 'Jane',    last: 'Doe' } });
    const afterBoth =   () => ({ type: 'after',  result: [{ first: 'John',    last: 'Doe' }, { first: 'Jane', last: 'Doe' }] });
    const afterPage =   () => ({ type: 'after',  result: { total: 2, skip: 0, data: [{ first: 'John', last: 'Doe' }, { first: 'Jane', last: 'Doe' }] } });

    const decisionTable = [
      // desc,                      context,       method,   provider,  args,            result
      ['before::create',            beforeJohn(),  'create', null,      ['first'],       { last: 'Doe' }                        ],
      ['after::find with paginate', afterPage(),   'find',   null,      ['last'],        [{ first: 'John' }, { first: 'Jane' }] ],
      ['after::find no paginate',   afterBoth(),   'find',   null,      ['last'],        [{ first: 'John' }, { first: 'Jane' }] ],
      ['after',                     afterJane(),   'create', null,      ['last'],        { first: 'Jane'}                       ],
      ['call internally on server', afterJane(),   'create', undefined, ['last'],        { first: 'Jane'}                       ],
      ['not throw field missing',   beforeJohn(),  'create', 'rest',    ['first', 'xx'], { last: 'Doe' }                        ],
      ['not throw field undefined', beforeUndef(), 'create', 'rest',    ['first'],       { last: 'Doe' }      ],
      ['not throw field null',      beforeNull(),  'create', 'rest',    ['first'],       { last: 'Doe' }                        ],
    ];
    /* eslint-enable */

    decisionTable.forEach(([desc, context, method, provider, args, result]) => {
      it(desc, () => {
        context.method = method;
        if (provider !== null) {
          context.params = context.params || {};
          context.params.provider = provider;
        }

        discard(...args)(context);
        assert.deepEqual(context.data ? context.data : context.result.data || context.result, result);
      });
    });
  });

  describe('handles dot notation', () => {
    /* eslint-disable */
    const ctx  = () => ({ type: 'before', method: 'create', data:   { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' } });
    const ctx2 = () => ({ type: 'after',  method: 'get',    result: { property: null, foo: 'bar' } });

    const decisionTable = [
      // desc,           context, args,                    result
      ['handles dots',   ctx(),   ['dept'],                { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }               } ],
      ['handle 1 dot',   ctx(),   ['empl.status'],         { empl: { name: { first: 'John', last: 'Doe' }               }, dept: 'Acct' } ],
      ['handle 2 dot',   ctx(),   ['empl.name.first'],     { empl: { name: {                last: 'Doe' }, status: 'AA' }, dept: 'Acct' } ],
      ['missing path',   ctx(),   ['empl.xx.first'],       { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' } ],
      ['missing no dot', ctx(),   ['xx'],                  { empl: { name: { first: 'John', last: 'Doe' }, status: 'AA' }, dept: 'Acct' } ],
      ['2 fields',       ctx(),   ['empl.status', 'dept'], { empl: { name: { first: 'John', last: 'Doe' }               }               } ],
      ['path not obj',   ctx2(),  ['property.secret'],     { property: null, foo: 'bar' }                                                 ],
    ];
    /* eslint-enable */

    decisionTable.forEach(([desc, context, args, result]) => {
      it(desc, () => {
        discard(...args)(context);
        assert.deepEqual(context.data ? context.data : context.result.data || context.result, result);
      });
    });
  });
});
