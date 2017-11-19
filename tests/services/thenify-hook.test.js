
const { assert } = require('chai');
const { fastJoin, keep, thenifyHook } = require('../../lib/services');

let app = { a: 'a' };
let params = { p: 'p' };
let service = { s: 's' };
let thenify;
let thenified;
let hook;

const testHook = hook1 => {
  hook = hook1;

  hook1._called = 'called';
  return hook1;
};

describe('services thenifyHook', () => {
  beforeEach(() => {
    thenify = thenifyHook({ app, params, service });
    thenified = thenifyHook();
  });

  it('get expected hook & object result', () => {
    const data = { name: 'john' };

    return Promise.resolve(data)
        .then(thenify(testHook))
        .then(result => {
          assert.deepEqual(result, data, 'test result');
          assert.deepEqual(hook, {
            app, params, service, _called: 'called', result: data, type: 'after'
          }, 'test hook');
        });
  });

  it('get expected array result', () => {
    const data = [{ name: 'john' }];

    return Promise.resolve(data)
      .then(thenify(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
      });
  });

  it('get expected find result', () => {
    const data = { total: 1, data: [{ name: 'john' }] };

    return Promise.resolve(data)
      .then(thenify(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
      });
  });

  it('test using keep hook', () => {
    const data = [{ name: 'John', job: 'dev', address: { city: 'Montreal', postal: 'H4T 2A1' }}];

    return Promise.resolve(data)
      .then(thenified(keep('name', 'address.city')))
      .then(result => {
        assert.deepEqual(result, [{ name: 'John', address: { city: 'Montreal' }}]);
      });
  });

  it('test using fastJoin hook', () => {
    const paymentsRecords= [
      { _id: 101, amount: 100, patientId: 1 },
      { _id: 102, amount: 105, patientId: 1 },
      { _id: 103, amount: 110, patientId: 1 },
      { _id: 104, amount: 115, patientId: 2 },
      { _id: 105, amount: 120, patientId: 3 },
      { _id: 106, amount: 125, patientId: 3 },
    ];

    const patientsRecords = [
      { _id: 1, name: 'John' },
      { _id: 2, name: 'Marshall' },
      { _id: 3, name: 'David' },
    ];

    const paymentResolvers = {
      joins: {
        patient: () => async payment => {
          payment.patient = (
            patientsRecords.filter(patient => patient._id === payment.patientId)
          )[0]
        },
      }
    };

    const expected = [
      { _id: 101, amount: 100, patientId: 1, patient: { _id: 1, name: 'John' } },
      { _id: 102, amount: 105, patientId: 1, patient: { _id: 1, name: 'John' } },
      { _id: 103, amount: 110, patientId: 1, patient: { _id: 1, name: 'John' } },
      { _id: 104, amount: 115, patientId: 2, patient: { _id: 2, name: 'Marshall' } },
      { _id: 105, amount: 120, patientId: 3, patient: { _id: 3, name: 'David' } },
      { _id: 106, amount: 125, patientId: 3, patient: { _id: 3, name: 'David' } } ]

    return Promise.resolve(paymentsRecords)
      .then(thenified(fastJoin(paymentResolvers)))
      .then(result => {
        assert.deepEqual(result, expected);
      });
  });
});
