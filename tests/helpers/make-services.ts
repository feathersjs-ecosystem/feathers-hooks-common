
const postsStore = [
  {
    id: 1,
    body: 'John post',
    userId: 101,
    starIds: [102, 103, 104],
    reputation: [ // The current populate hook cannot handle this structure.
      { userId: 102, points: 1 },
      { userId: 103, points: 1 },
      { userId: 104, points: 1 }
    ]
  },
  { id: 2, body: 'Marshall post', userId: 102, starIds: [101, 103, 104] },
  { id: 3, body: 'Barbara post', userId: 103 },
  { id: 4, body: 'Aubree post', userId: 104 }
];

const commentsStore = [
  { id: 11, text: 'John post Marshall comment 11', postId: 1, userId: 102 },
  { id: 12, text: 'John post Marshall comment 12', postId: 1, userId: 102 },
  { id: 13, text: 'John post Marshall comment 13', postId: 1, userId: 102 },
  { id: 14, text: 'Marshall post John comment 14', postId: 2, userId: 101 },
  { id: 15, text: 'Marshall post John comment 15', postId: 2, userId: 101 },
  { id: 16, text: 'Barbara post John comment 16', postId: 3, userId: 101 },
  { id: 17, text: 'Aubree post Marshall comment 17', postId: 4, userId: 102 }
];

const usersStore = [
  { id: 101, name: 'John' },
  { id: 102, name: 'Marshall' },
  { id: 103, name: 'Barbara' },
  { id: 104, name: 'Aubree' }
];

module.exports = {
  posts: makeService(postsStore, 'posts'),
  comments: makeService(commentsStore, 'comments'),
  users: makeService(usersStore, 'users')
};

function makeService (store1, name) {
  return {
    get (id) {
      // console.log(`... ${name} get ${id}`);
      const store = clone(store1);

      for (let i = 0, leni = store.length; i < leni; i++) {
        if (store[i].id === id) return asyncReturn(store[i]);
      }

      throw Error(`post id ${id} not found`);
    },

    find (params) {
      // console.log(`... ${name} find`, params ? params.query : '');
      const store = clone(store1);

      if (!params || !params.query) return asyncReturn(store);

      const field = Object.keys(params.query)[0];
      const value = params.query[field];
      const $select = params.query.$select;

      return asyncReturn(store
        .filter(post => {
          return typeof value !== 'object'
            ? post[field] === value
            : value.$in.indexOf(post[field]) !== -1;
        })
        .map(post => pluck(post, $select))
      );
    }
  };
}

function asyncReturn (value) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(value); }, 10);
  });
}

function pluck (obj, fields) {
  if (!fields) return obj;

  const res = {};

  fields.forEach(name => {
    if (name in obj) {
      res[name] = obj[name];
    }
  });

  return res;
}

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
