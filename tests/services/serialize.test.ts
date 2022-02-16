
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'assert'.
const assert = require('assert').strict;
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'serialize'... Remove this comment to see the full error message
const { serialize } = require('../../lib/services');

// @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('services serialize', () => {
  let hookAfter: any;
  let schema: any;

  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      path: 'recommendations',
      result: {}
    };

    schema = {
      only: ['updatedAt'],
      computed: {
        commentsCount: (recommendation: any, hook: any) => recommendation.post.commentsInfo.length
      },
      post: {
        exclude: ['id', 'createdAt', 'author', 'readers', '_id'],
        authorInfo: {
          exclude: ['id', 'password', '_id', 'age'],
          computed: {
            isUnder18: (authorInfo: any, hook: any) => authorInfo.age < 18
          }
        },
        readersInfo: {
          exclude: 'id'
        },
        commentsInfo: {
          only: ['title', 'content'],
          exclude: 'content'
        }
      }
    };
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('for one item', () => {
    const hook = clone(hookAfter);
    hook.result = {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475,
      _include: ['post'],
      _elapsed: { post: 1, total: 1 },
      post:
      {
        id: 1,
        title: 'Post 1',
        content: 'Lorem ipsum dolor sit amet 4',
        author: 'as61389dadhga62343hads6712',
        readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
        createdAt: 1480793101559,
        _include: ['authorInfo', 'commentsInfo', 'readersInfo'],
        _elapsed: { authorInfo: 2, commentsInfo: 2, readersInfo: 2, total: 2 },
        authorInfo: {
          id: 'as61389dadhga62343hads6712',
          name: 'Author 1',
          email: 'author1@posties.com',
          password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
          age: 55
        },
        commentsInfo:
        [
          {
            title: 'Comment 1',
            content: 'Lorem ipsum dolor sit amet 1',
            postId: 1
          },
          {
            title: 'Comment 3',
            content: 'Lorem ipsum dolor sit amet 3',
            postId: 1
          }
        ],
        readersInfo:
        [
          {
            id: 'as61389dadhga62343hads6712',
            name: 'Author 1',
            email: 'author1@posties.com',
            password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
            age: 55
          },
          {
            id: '167asdf3689348sdad7312131s',
            name: 'Author 2',
            email: 'author2@posties.com',
            password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
            age: 16
          }
        ]
      }
    };

    const hook1 = serialize(schema)(hook);

    assert.deepEqual(hook1,
      {
        type: 'after',
        method: 'create',
        params: { provider: 'rest' },
        path: 'recommendations',
        result: {
          updatedAt: 1480793101475,
          _include: ['post'],
          _elapsed: { post: 1, total: 1 },
          post: {
            title: 'Post 1',
            content: 'Lorem ipsum dolor sit amet 4',
            _include: ['authorInfo', 'commentsInfo', 'readersInfo'],
            _elapsed: { authorInfo: 2, commentsInfo: 2, readersInfo: 2, total: 2 },
            authorInfo: {
              name: 'Author 1',
              email: 'author1@posties.com',
              isUnder18: false,
              _computed: ['isUnder18']
            },
            commentsInfo: [{ title: 'Comment 1' }, { title: 'Comment 3' }],
            readersInfo: [
              {
                name: 'Author 1',
                email: 'author1@posties.com',
                password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
                age: 55
              },
              {
                name: 'Author 2',
                email: 'author2@posties.com',
                password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
                age: 16
              }
            ]
          },
          commentsCount: 2,
          _computed: ['commentsCount']
        }
      }
    );
  });

  // @ts-expect-error ts-migrate(2582) FIXME: Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
  it('schema param is not changed', () => {
    const schema1 = (hook: any) => {
      return {};
    };

    const hook = clone(hookAfter);
    hook.result = {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475,
      _include: ['post'],
      _elapsed: { post: 1, total: 1 },
      post:
      {
        id: 1,
        title: 'Post 1',
        content: 'Lorem ipsum dolor sit amet 4',
        author: 'as61389dadhga62343hads6712',
        readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
        createdAt: 1480793101559,
        _include: ['authorInfo', 'commentsInfo', 'readersInfo'],
        _elapsed: { authorInfo: 2, commentsInfo: 2, readersInfo: 2, total: 2 },
        authorInfo: {
          id: 'as61389dadhga62343hads6712',
          name: 'Author 1',
          email: 'author1@posties.com',
          password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
          age: 55
        },
        commentsInfo:
        [
          {
            title: 'Comment 1',
            content: 'Lorem ipsum dolor sit amet 1',
            postId: 1
          },
          {
            title: 'Comment 3',
            content: 'Lorem ipsum dolor sit amet 3',
            postId: 1
          }
        ],
        readersInfo:
        [
          {
            id: 'as61389dadhga62343hads6712',
            name: 'Author 1',
            email: 'author1@posties.com',
            password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
            age: 55
          },
          {
            id: '167asdf3689348sdad7312131s',
            name: 'Author 2',
            email: 'author2@posties.com',
            password: '2347wjkadhad8y7t2eeiudhd98eu2rygr',
            age: 16
          }
        ]
      }
    };

    assert.equal(typeof schema1, 'function');

    for (let i = 1; i < 3; i++) {
      serialize(schema1)(hook);
      assert.equal(typeof schema1, 'function');
    }

    serialize(schema1)(hook);
    assert.equal(typeof schema1, 'function');
  });
});

// Helpers

function clone (obj: any) {
  return JSON.parse(JSON.stringify(obj));
}
