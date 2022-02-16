
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('chai').assert;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sequelizeC... Remove this comment to see the full error message
const sequelizeConvert = require('../../lib/services/sequelize-convert');

const converts = {
  isInvitation: 'boolean',
  isVerified: 'boolean',
  verifyExpires: 'date',
  verifyChanges: 'json',
  resetExpires: 'date',
  mfaExpires: 'date',
  passwordHistory: 'json'
};

const convertDatetime = {
  sql: (dateNow: any) => new Date(dateNow).toISOString(),
  js: (sqlDate: any) => new Date(sqlDate).valueOf()
};

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('conversion-sql.test.js', function () {
  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('as before hook', () => {
    let context: any;
    let contextArray: any;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      context = {
        type: 'before',
        method: 'create',
        data: {
          isInvitation: false,
          isVerified: true,
          verifyExpires: 11111,
          verifyToken: '00000',
          verifyShortToken: '00',
          verifyChanges: { foo: 'bar', baz: 'bas' },
          resetExpires: 22222,
          resetToken: '99999',
          resetShortToken: '99',
          mfaExpires: 33333,
          mfaShortToken: '77777',
          mfaType: '2fa'
        }
      };

      contextArray = {
        type: 'before',
        method: 'create',
        data: [
          {
            isInvitation: false,
            isVerified: true,
            verifyExpires: 11111,
            verifyToken: '00000',
            verifyShortToken: '00',
            verifyChanges: { foo: 'bar', baz: 'bas' },
            resetExpires: 22222,
            resetToken: '99999',
            resetShortToken: '99',
            mfaExpires: 33333,
            mfaShortToken: '77777',
            mfaType: '2fa'
          }, {
            isInvitation: true,
            isVerified: false,
            verifyExpires: 11111,
            verifyToken: '00000',
            verifyShortToken: '00',
            verifyChanges: { foo: 'bar', baz: 'bas' },
            resetExpires: 22222,
            resetToken: '99999',
            resetShortToken: '99',
            mfaExpires: 33333,
            mfaShortToken: '77777',
            mfaType: '2fa'
          }
        ]
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('converts single object', () => {
      const newContext = sequelizeConvert(converts)(context);

      assert.deepEqual(newContext.data, {
        isInvitation: 0,
        isVerified: 1,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: '{"foo":"bar","baz":"bas"}',
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('converts array of objects', () => {
      const newContext = sequelizeConvert(converts)(contextArray);

      assert.deepEqual(newContext.data, [{
        isInvitation: 0,
        isVerified: 1,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: '{"foo":"bar","baz":"bas"}',
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      }, {
        isInvitation: 1,
        isVerified: 0,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: '{"foo":"bar","baz":"bas"}',
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses datetime converter', () => {
      const newContext = sequelizeConvert(converts, null, { date: convertDatetime })(context);

      assert.deepEqual(newContext.data, {
        isInvitation: 0,
        isVerified: 1,
        verifyExpires: '1970-01-01T00:00:11.111Z',
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: '{"foo":"bar","baz":"bas"}',
        resetExpires: '1970-01-01T00:00:22.222Z',
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: '1970-01-01T00:00:33.333Z',
        mfaShortToken: '77777',
        mfaType: '2fa'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respects fields to ignore', () => {
      const newContext = sequelizeConvert(converts, ['isInvitation', 'isVerified', 'verifyChanges'])(context);

      assert.deepEqual(newContext.data, {
        isInvitation: false,
        isVerified: true,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      });
    });
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('as after hook', () => {
    let context: any;
    let contextISO: any;
    let contextArray: any;
    let contextPaginated: any;

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
    beforeEach(() => {
      context = {
        type: 'after',
        method: 'create',
        result: {
          isInvitation: 0,
          isVerified: 1,
          verifyExpires: 11111,
          verifyToken: '00000',
          verifyShortToken: '00',
          verifyChanges: '{"foo":"bar","baz":"bas"}',
          resetExpires: 22222,
          resetToken: '99999',
          resetShortToken: '99',
          mfaExpires: 33333,
          mfaShortToken: '77777',
          mfaType: '2fa'
        }
      };

      contextISO = {
        type: 'after',
        method: 'create',
        result: {
          isInvitation: 0,
          isVerified: 1,
          verifyExpires: '1970-01-01T00:00:11.111Z',
          verifyToken: '00000',
          verifyShortToken: '00',
          verifyChanges: '{"foo":"bar","baz":"bas"}',
          resetExpires: '1970-01-01T00:00:22.222Z',
          resetToken: '99999',
          resetShortToken: '99',
          mfaExpires: '1970-01-01T00:00:33.333Z',
          mfaShortToken: '77777',
          mfaType: '2fa'
        }
      };

      contextArray = {
        type: 'after',
        method: 'create',
        result: [
          {
            isInvitation: 0,
            isVerified: 1,
            verifyExpires: 11111,
            verifyToken: '00000',
            verifyShortToken: '00',
            verifyChanges: '{"foo":"bar","baz":"bas"}',
            resetExpires: 22222,
            resetToken: '99999',
            resetShortToken: '99',
            mfaExpires: 33333,
            mfaShortToken: '77777',
            mfaType: '2fa'
          }, {
            isInvitation: 1,
            isVerified: 0,
            verifyExpires: 11111,
            verifyToken: '00000',
            verifyShortToken: '00',
            verifyChanges: '{"foo":"bar","baz":"bas"}',
            resetExpires: 22222,
            resetToken: '99999',
            resetShortToken: '99',
            mfaExpires: 33333,
            mfaShortToken: '77777',
            mfaType: '2fa'
          }
        ]
      };

      contextPaginated = {
        type: 'after',
        method: 'find',
        result: {
          data: [{
            isInvitation: 0,
            isVerified: 1,
            verifyExpires: 11111,
            verifyToken: '00000',
            verifyShortToken: '00',
            verifyChanges: '{"foo":"bar","baz":"bas"}',
            resetExpires: 22222,
            resetToken: '99999',
            resetShortToken: '99',
            mfaExpires: 33333,
            mfaShortToken: '77777',
            mfaType: '2fa'
          }, {
            isInvitation: 1,
            isVerified: 0,
            verifyExpires: 11111,
            verifyToken: '00000',
            verifyShortToken: '00',
            verifyChanges: '{"foo":"bar","baz":"bas"}',
            resetExpires: 22222,
            resetToken: '99999',
            resetShortToken: '99',
            mfaExpires: 33333,
            mfaShortToken: '77777',
            mfaType: '2fa'
          }
          ]
        }
      };
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('converts single object', () => {
      const newContext = sequelizeConvert(converts)(context);

      assert.deepEqual(newContext.result, {
        isInvitation: false,
        isVerified: true,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('uses datetime converter', () => {
      const newContext = sequelizeConvert(converts, null, { date: convertDatetime })(contextISO);

      assert.deepEqual(newContext.result, {
        isInvitation: false,
        isVerified: true,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      });
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('converts array of objects, not paginated', () => {
      const newContext = sequelizeConvert(converts)(contextArray);

      assert.deepEqual(newContext.result, [{
        isInvitation: false,
        isVerified: true,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      }, {
        isInvitation: true,
        isVerified: false,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('converts array of objects, paginated', () => {
      const newContext = sequelizeConvert(converts)(contextPaginated);

      assert.deepEqual(newContext.result.data, [{
        isInvitation: false,
        isVerified: true,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      }, {
        isInvitation: true,
        isVerified: false,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: { foo: 'bar', baz: 'bas' },
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      }]);
    });

    // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('respects fields to ignore', () => {
      const newContext = sequelizeConvert(converts, ['isInvitation', 'isVerified', 'verifyChanges'])(context);

      assert.deepEqual(newContext.result, {
        isInvitation: 0,
        isVerified: 1,
        verifyExpires: 11111,
        verifyToken: '00000',
        verifyShortToken: '00',
        verifyChanges: '{"foo":"bar","baz":"bas"}',
        resetExpires: 22222,
        resetToken: '99999',
        resetShortToken: '99',
        mfaExpires: 33333,
        mfaShortToken: '77777',
        mfaType: '2fa'
      });
    });
  });
});
