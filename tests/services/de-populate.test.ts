
const assert = require('assert').strict;
const { dePopulate } = require('../../lib/services/index');

describe('services dePopulate - not dot notation', () => {
  let hookAfter;
  let hookBeforeArray;
  let hookBefore;

  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: {
        userId: 'as61389dadhga62343hads6712',
        postId: 1,
        updatedAt: 1480793101475,
        _include: ['post', 'x'],
        _elapsed: { post: 16051500, total: 20707798, x: 1 },
        _computed: ['a1', 'a1'],
        a1: 1,
        post: {
          id: 1,
          title: 'Post 1',
          content: 'Lorem ipsum dolor sit amet 4',
          author: 'as61389dadhga62343hads6712',
          readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
          createdAt: 1480793101559
        }
      }
    };
    hookBefore = {
      type: 'before',
      method: 'update',
      params: { provider: 'rest' },
      data: {
        userId: 'as61389dadhga62343hads6712',
        postId: 1,
        updatedAt: 1480793101475
      }
    };
    hookBeforeArray = {
      type: 'before',
      method: 'patch',
      params: { provider: 'rest' },
      data: [
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 1,
          updatedAt: 1480793101475,
          _include: ['post'],
          _elapsed: { post: 3456238, total: 3642135 },
          post: {
            id: 1,
            title: 'Post 1',
            content: 'Lorem ipsum dolor sit amet 4',
            author: 'as61389dadhga62343hads6712',
            readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
            createdAt: 1480793101559
          }
        },
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 2,
          updatedAt: 1480793101475,
          _include: ['post'],
          _elapsed: { post: 3457496, total: 3878535 },
          post: {
            id: 2,
            title: 'Post 2',
            content: 'Lorem ipsum dolor sit amet 5',
            author: '167asdf3689348sdad7312131s',
            readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
            createdAt: 1480793101559
          }
        },
        {
          userId: '167asdf3689348sdad7312131s',
          postId: 1,
          updatedAt: 1480793101475,
          _include: ['post'],
          _elapsed: { post: 3446912, total: 3857237 },
          post: {
            id: 1,
            title: 'Post 1',
            content: 'Lorem ipsum dolor sit amet 4',
            author: 'as61389dadhga62343hads6712',
            readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
            createdAt: 1480793101559
          }
        }
      ]
    };
  });

  it('one item, after hook, missing props', () => {
    const hook = clone(hookAfter);
    const deHook = dePopulate()(hook);
    assert.deepEqual(deHook.result, {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475
    });
  });

  it('one item, before hook, not populated', () => {
    const hook = clone(hookBefore);
    const deHook = dePopulate()(hook);
    assert.deepEqual(deHook.data, {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475
    });
  });

  it('item array, before hook', () => {
    const hook = clone(hookBeforeArray);
    const deHook = dePopulate()(hook);
    assert.deepEqual(deHook.data,
      [
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 1,
          updatedAt: 1480793101475
        },
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 2,
          updatedAt: 1480793101475
        },
        {
          userId: '167asdf3689348sdad7312131s',
          postId: 1,
          updatedAt: 1480793101475
        }
      ]
    );
  });
});

describe('services dePopulate - dot notation', () => {
  let hookAfter;
  let hookBeforeArray;
  let hookBefore;

  beforeEach(() => {
    hookAfter = {
      type: 'after',
      method: 'create',
      params: { provider: 'rest' },
      result: {
        userId: 'as61389dadhga62343hads6712',
        postId: 1,
        updatedAt: 1480793101475,
        _include: ['post.a.b', 'x'],
        _elapsed: { post: 16051500, total: 20707798, x: 1 },
        _computed: ['a1', 'a1'],
        a1: 1,
        post: {
          a: {
            b: {
              id: 1,
              title: 'Post 1',
              content: 'Lorem ipsum dolor sit amet 4',
              author: 'as61389dadhga62343hads6712',
              readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
              createdAt: 1480793101559
            }
          }
        }
      }
    };
    hookBefore = {
      type: 'before',
      method: 'update',
      params: { provider: 'rest' },
      data: {
        userId: 'as61389dadhga62343hads6712',
        postId: 1,
        updatedAt: 1480793101475
      }
    };
    hookBeforeArray = {
      type: 'before',
      method: 'patch',
      params: { provider: 'rest' },
      data: [
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 1,
          updatedAt: 1480793101475,
          _include: ['post.a'],
          _elapsed: { post: 3456238, total: 3642135 },
          post: {
            a: {
              id: 1,
              title: 'Post 1',
              content: 'Lorem ipsum dolor sit amet 4',
              author: 'as61389dadhga62343hads6712',
              readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
              createdAt: 1480793101559
            }
          }
        },
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 2,
          updatedAt: 1480793101475,
          _include: ['post.a', 'x', 'post.b.c', 'comments'],
          _elapsed: { post: 3457496, total: 3878535 },
          comments: {},
          post: {
            a: {
              id: 2,
              title: 'Post 2',
              content: 'Lorem ipsum dolor sit amet 5',
              author: '167asdf3689348sdad7312131s',
              readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
              createdAt: 1480793101559
            }
          }
        },
        {
          userId: '167asdf3689348sdad7312131s',
          postId: 1,
          updatedAt: 1480793101475,
          _include: ['post'],
          _elapsed: { post: 3446912, total: 3857237 },
          post: {
            id: 1,
            title: 'Post 1',
            content: 'Lorem ipsum dolor sit amet 4',
            author: 'as61389dadhga62343hads6712',
            readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
            createdAt: 1480793101559
          }
        }
      ]
    };
  });

  it('one item, after hook, missing props', () => {
    const hook = clone(hookAfter);
    const deHook = dePopulate()(hook);
    assert.deepEqual(deHook.result, {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475,
      post: { a: {} }
    });
  });

  it('one item, before hook, not populated', () => {
    const hook = clone(hookBefore);
    const deHook = dePopulate()(hook);
    assert.deepEqual(deHook.data, {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475
    });
  });

  it('item array, before hook', () => {
    const hook = clone(hookBeforeArray);
    const deHook = dePopulate()(hook);
    assert.deepEqual(deHook.data,
      [
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 1,
          updatedAt: 1480793101475,
          post: {}
        },
        {
          userId: 'as61389dadhga62343hads6712',
          postId: 2,
          updatedAt: 1480793101475,
          post: {}
        },
        {
          userId: '167asdf3689348sdad7312131s',
          postId: 1,
          updatedAt: 1480793101475
        }
      ]
    );
  });
});

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
