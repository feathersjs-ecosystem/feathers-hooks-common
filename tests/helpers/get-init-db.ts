
module.exports = function (name) {
  const users = {
    0: { id: 'as61389dadhga62343hads6712', name: 'Author 1', email: 'author1@posties.com', password: '2347wjkadhad8y7t2eeiudhd98eu2rygr', age: 55 },
    1: { id: '167asdf3689348sdad7312131s', name: 'Author 2', email: 'author2@posties.com', password: '2347wjkadhad8y7t2eeiudhd98eu2rygr', age: 16 }
  };

  const comments = {
    1: {
      id: 1,
      postId: 1,
      title: 'Comment 1',
      content: 'Lorem ipsum dolor sit amet 1',
      author: 'as61389dadhga62343hads6712',
      createdAt: 1480793101559
    },
    2: {
      id: 2,
      postId: 2,
      title: 'Comment 2',
      content: 'Lorem ipsum dolor sit amet 2',
      author: 'as61389dadhga62343hads6712',
      createdAt: 1480793101559
    },
    3: {
      id: 3,
      postId: 1,
      title: 'Comment 3',
      content: 'Lorem ipsum dolor sit amet 3',
      author: '167asdf3689348sdad7312131s',
      createdAt: 1480793101559
    }
  };

  const posts = {
    1: {
      id: 1,
      title: 'Post 1',
      content: 'Lorem ipsum dolor sit amet 4',
      author: 'as61389dadhga62343hads6712',
      readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
      createdAt: 1480793101559
    },
    2: {
      id: 2,
      title: 'Post 2',
      content: 'Lorem ipsum dolor sit amet 5',
      author: '167asdf3689348sdad7312131s',
      readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
      createdAt: 1480793101559
    },
    3: {
      id: 3,
      title: 'Post 3',
      content: 'Lorem ipsum dolor sit amet 5',
      author: '167asdf3689348sdad7312131s',
      readers: ['as61389dadhga62343hads6712', '167asdf3689348sdad7312131s'],
      createdAt: 1480793101559
    },
    4: {
      id: 4,
      title: 'Post 4',
      content: 'Lorem ipsum dolor sit amet 5',
      author: '167asdf3689348sdad7312131s',
      readers: [],
      createdAt: 1480793101559
    }
  };

  const recommendation = {
    1: {
      userId: 'as61389dadhga62343hads6712',
      postId: 1,
      updatedAt: 1480793101475
    },
    2: {
      userId: 'as61389dadhga62343hads6712',
      postId: 2,
      updatedAt: 1480793101475
    },
    3: {
      userId: '167asdf3689348sdad7312131s',
      postId: 1,
      updatedAt: 1480793101475
    }
  };

  const dbs = {
    users,
    comments,
    posts,
    recommendation
  };

  // console.log(`returning db for ${name}`);
  return {
    store: dbs[name],
    idField: '_id'
  };
};
