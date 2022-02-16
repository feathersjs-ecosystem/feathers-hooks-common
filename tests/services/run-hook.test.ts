
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const { assert } = require('chai');
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'fastJoin'.
const { fastJoin, keep, runHook } = require('../../lib/services');

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'app'.
const app = { a: 'a' };
const params = { p: 'p' };
const service = { s: 's' };
let runHooks1: any;
let runHooks2: any;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'hook'.
let hook;

// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'testHook'.
const testHook = (hook1: any) => {
  hook = hook1;

  hook1._called = 'called';
  return hook1;
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services runHooks', () => {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    runHooks1 = runHook({ app, params, service });
    runHooks2 = runHook();
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('get expected hook & object result', () => {
    const data = { name: 'john' };

    return Promise.resolve(data)
      .then(runHooks1(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
        assert.deepEqual(hook, {
          app, params, service, _called: 'called', result: data, type: 'after'
        }, 'test hook');
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('get expected array result', () => {
    const data = [{ name: 'john' }];

    return Promise.resolve(data)
      .then(runHooks1(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('get expected find result', () => {
    const data = { total: 1, data: [{ name: 'john' }] };

    return Promise.resolve(data)
      .then(runHooks1(testHook))
      .then(result => {
        assert.deepEqual(result, data, 'test result');
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('test using keep hook', () => {
    const data = [{ name: 'John', job: 'dev', address: { city: 'Montreal', postal: 'H4T 2A1' } }];

    return Promise.resolve(data)
      .then(runHooks2(keep('name', 'address.city')))
      .then(result => {
        assert.deepEqual(result, [{ name: 'John', address: { city: 'Montreal' } }]);
      });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('test using fastJoin hook', () => {
    const paymentsRecords = [
      { _id: 101, amount: 100, patientId: 1 },
      { _id: 102, amount: 105, patientId: 1 },
      { _id: 103, amount: 110, patientId: 1 },
      { _id: 104, amount: 115, patientId: 2 },
      { _id: 105, amount: 120, patientId: 3 },
      { _id: 106, amount: 125, patientId: 3 }
    ];

    const patientsRecords = [
      { _id: 1, name: 'John' },
      { _id: 2, name: 'Marshall' },
      { _id: 3, name: 'David' }
    ];

    const paymentResolvers = {
      joins: {
        patient: () => (payment: any) => {
          payment.patient = (
            patientsRecords.filter(patient => patient._id === payment.patientId)
          )[0];
        }
      }
    };

    const expected = [
      { _id: 101, amount: 100, patientId: 1, patient: { _id: 1, name: 'John' } },
      { _id: 102, amount: 105, patientId: 1, patient: { _id: 1, name: 'John' } },
      { _id: 103, amount: 110, patientId: 1, patient: { _id: 1, name: 'John' } },
      { _id: 104, amount: 115, patientId: 2, patient: { _id: 2, name: 'Marshall' } },
      { _id: 105, amount: 120, patientId: 3, patient: { _id: 3, name: 'David' } },
      { _id: 106, amount: 125, patientId: 3, patient: { _id: 3, name: 'David' } }];

    return Promise.resolve(paymentsRecords)
      .then(runHooks2(fastJoin(paymentResolvers)))
      .then(result => {
        assert.deepEqual(result, expected);
      });
  });
});
