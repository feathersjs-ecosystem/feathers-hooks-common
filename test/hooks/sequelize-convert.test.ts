import { assert } from 'chai';
import { sequelizeConvert } from '../../src';

const converts: any = {
  isInvitation: 'boolean',
  isVerified: 'boolean',
  verifyExpires: 'date',
  verifyChanges: 'json',
  resetExpires: 'date',
  mfaExpires: 'date',
  passwordHistory: 'json',
};

const convertDatetime = {
  sql: (dateNow: any) => new Date(dateNow).toISOString(),
  js: (sqlDate: any) => new Date(sqlDate).valueOf(),
};

describe('sequelize-convert.test.ts', function () {
  describe('as before hook', () => {
    let context: any;
    let contextArray: any;

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
          mfaType: '2fa',
        },
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
            mfaType: '2fa',
          },
          {
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
            mfaType: '2fa',
          },
        ],
      };
    });

    it('converts single object', () => {
      const newContext: any = sequelizeConvert(converts)(context);

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
        mfaType: '2fa',
      });
    });

    it('converts array of objects', () => {
      const newContext: any = sequelizeConvert(converts)(contextArray);

      assert.deepEqual(newContext.data, [
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
          mfaType: '2fa',
        },
        {
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
          mfaType: '2fa',
        },
      ]);
    });

    it('uses datetime converter', () => {
      const newContext: any = sequelizeConvert(converts, null, { date: convertDatetime })(context);

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
        mfaType: '2fa',
      });
    });

    it('respects fields to ignore', () => {
      const newContext: any = sequelizeConvert(converts, [
        'isInvitation',
        'isVerified',
        'verifyChanges',
      ])(context);

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
        mfaType: '2fa',
      });
    });
  });

  describe('as after hook', () => {
    let context: any;
    let contextISO: any;
    let contextArray: any;
    let contextPaginated: any;

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
          mfaType: '2fa',
        },
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
          mfaType: '2fa',
        },
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
            mfaType: '2fa',
          },
          {
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
            mfaType: '2fa',
          },
        ],
      };

      contextPaginated = {
        type: 'after',
        method: 'find',
        result: {
          data: [
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
              mfaType: '2fa',
            },
            {
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
              mfaType: '2fa',
            },
          ],
        },
      };
    });

    it('converts single object', () => {
      const newContext: any = sequelizeConvert(converts)(context);

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
        mfaType: '2fa',
      });
    });

    it('uses datetime converter', () => {
      const newContext: any = sequelizeConvert(converts, null, { date: convertDatetime })(
        contextISO
      );

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
        mfaType: '2fa',
      });
    });

    it('converts array of objects, not paginated', () => {
      const newContext: any = sequelizeConvert(converts)(contextArray);

      assert.deepEqual(newContext.result, [
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
          mfaType: '2fa',
        },
        {
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
          mfaType: '2fa',
        },
      ]);
    });

    it('converts array of objects, paginated', () => {
      const newContext: any = sequelizeConvert(converts)(contextPaginated);

      assert.deepEqual(newContext.result.data, [
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
          mfaType: '2fa',
        },
        {
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
          mfaType: '2fa',
        },
      ]);
    });

    it('respects fields to ignore', () => {
      const newContext: any = sequelizeConvert(converts, [
        'isInvitation',
        'isVerified',
        'verifyChanges',
      ])(context);

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
        mfaType: '2fa',
      });
    });
  });
});
