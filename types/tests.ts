import { Hook, HookContext, Service, feathers } from '@feathersjs/feathers';

import {
    actOnDefault,
    actOnDispatch,
    alterItems,
    AsyncContextFunction,
    AsyncPredicateFn,
    cache,
    callingParams,
    callingParamsDefaults,
    checkContext,
    checkContextIf,
    combine,
    debug,
    dePopulate,
    disablePagination,
    disallow,
    discard,
    discardQuery,
    every,
    fastJoin,
    fgraphql,
    FGraphQLHookOptions,
    getItems,
    iff,
    iffElse,
    isNot,
    isProvider,
    keep,
    keepInArray,
    keepQuery,
    keepQueryInArray,
    lowerCase,
    makeCallingParams,
    mongoKeys,
    paramsForServer,
    paramsFromClient,
    populate,
    preventChanges,
    replaceItems,
    required,
    ResolverMap,
    runHook,
    runParallel,
    sequelizeConvert,
    serialize,
    setNow,
    setSlug,
    sifter,
    softDelete,
    some,
    stashBefore,
    SyncPredicateFn,
    traverse,
    unless,
    validate,
    validateSchema,
    when,
} from 'feathers-hooks-common';
import { parse } from 'graphql';
import ajv = require('ajv');

const context1: HookContext = {
    type: 'before',
    app: feathers(),
    method: 'create',
    params: {},
    path: '/',
    service: null,
    arguments: [],
    event: null
};

const hook1: Hook = ctx => ctx;
const hook2: Hook = ctx => ctx;
const hook3: Hook = async ctx => ctx;
const hook4: Hook = async ctx => ctx;

const syncTrue: SyncPredicateFn = ctx => true;
const syncFalse: SyncPredicateFn = ctx => false;

const asyncTrue: AsyncPredicateFn = async ctx => true;
const asyncFalse: AsyncPredicateFn = async ctx => false;

const service1: Service<any> = null as any;

// TESTS BEGIN

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
actOnDefault(hook1, hook2, hook3, hook4);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
actOnDispatch(hook1, hook2, hook3, hook4);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
alterItems(rec => {
    delete rec.password;
});

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
alterItems(rec => rec.email = 'somestring'.toLowerCase()); // Like `lowerCase('email')`.

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
cache(new Map(), 'a', { clone: x => x });

// $ExpectType Params
callingParams({
    query: { id: { $in: [1, 2, 3] } },
    propNames: ['customProp'],
    newProps: { mongoose: { /*...*/ } },
    hooksToDisable: 'populate'
})(context1);

// $ExpectType void
callingParamsDefaults(['abc', 'def'], {
    someData: {}
});
// $ExpectType void
checkContext(context1, 'before', ['update', 'patch'], 'hookName');
// $ExpectType void
checkContext(context1, null, ['update', 'patch']);
// $ExpectType void
checkContext(context1, 'before', null, 'hookName');
// $ExpectType void
checkContext(context1, 'before');

// $ExpectType void
checkContextIf(context1, 'before', ['update', 'patch'], 'hookName');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
combine(hook1, hook2, hook3);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
debug('label', 'abc.def', 'ghi.jkl');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
dePopulate();

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
disablePagination();

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
disallow('external', 'server');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
discard('abc', 'def');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
discardQuery('abc', 'def');

softDelete({
    removeData: async () => ({})
});

const commentResolvers: ResolverMap<any> = {
    joins: {
        author: $select => async comment => {
            const authors = await service1.find({
                query: { id: comment.userId, $select: $select || ['name'] },
                paginate: false
            });
            comment.author = authors[0];
        },
    },
};

const postResolvers: ResolverMap<any> = {
    joins: {
        comments: {
            resolver: ($select, $limit, $sort) => async post => {
                post.comments = await service1.find({
                    query: { postId: post.id, $select, $limit: $limit || 5, [$sort]: { createdAt: -1 } },
                    paginate: false
                });
                return post.comments;
            },

            joins: commentResolvers,
        },
    }
};

const userResolvers: ResolverMap<any> = {
    joins: {
        memberships: () => async (user, context) => {
            const memberships = await context.app.service('memberships').find({
                query: {
                    user: user._id,
                    $populate: 'role',
                }
            });
            user.memberships = memberships.data;
        }
    }
};

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fastJoin(userResolvers);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fastJoin(postResolvers);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fastJoin(postResolvers, { abc: 'def' });
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fastJoin(ctx => postResolvers);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fastJoin(postResolvers);

// used from https://github.com/feathers-plus/hooks-graphql-example
const fgraphqlOptions: FGraphQLHookOptions = {
    parse,
    runTime: null,
    schema: ``,
    recordType: "user",
    query: {
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {}
    },
    resolvers: () => ({
        Comment: {
            author: () => ({}),
            likes: () => ({}),
        },
        Query: {}
    })
};
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fgraphql(fgraphqlOptions);

const fgraphqlOptions2: FGraphQLHookOptions = {
    ...fgraphqlOptions,
    query: (context: HookContext) => ({
        posts: {},
        comments: {},
        followed_by: {},
        following: {},
        likes: {}
    }),
    resolvers: {
        Comment: {
            author: () => ({}),
            likes: () => ({}),
        },
        Query: {}
    },
    options: {
        extraAuthProps: ['asdf'],
        inclAllFields: false,
        inclJoinedNames: false,
        inclAllFieldsClient: true,
        inclAllFieldsServer: true,
        skipHookWhen: (context) => { context.data; return false; }
    }
};
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
fgraphql(fgraphqlOptions2);

// $ExpectType any
getItems(context1);

// $ExpectType SyncContextFunction<boolean>
isProvider();

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
keep('abc', 'def');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
keepInArray('array', ['fieldName', 'fieldName']);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
keepQuery('name', 'address.city');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
keepQueryInArray('array', ['fieldName', 'fieldName']);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
lowerCase('email', 'username', 'div.dept');

// $ExpectType Params
makeCallingParams(
    context1,
    { id: { $in: [1, 2, 3] } },
    'user',
    { _populate: false, mongoose: {} }
);

// tslint:disable-next-line
class ObjId {
    // tslint:disable-next-line
    constructor(id?: string | number) { }
}

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
mongoKeys(ObjId, 'abc');
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
mongoKeys(ObjId, ['abc', 'def']);

paramsForServer({
    query: { dept: 'a' },
    populate: 'po-1',
    serialize: 'po-mgr'
});

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
paramsFromClient('populate', 'serialize', 'otherProp');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
populate({
    schema: {
        include: {
            service: 'roles',
            nameAs: 'role',
            parentField: 'roleId',
            childField: '_id'
        }
    }
});

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
preventChanges(true, 'security.badge', 'abc');

// $ExpectType void
replaceItems(context1, [{}, {}]);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
required('field1', 'field2');

// $ExpectType Promise<any>
runHook()(keep('abc'))([]);
// $ExpectType Promise<any>
runHook(context1)(keep('abc'))([]);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
runParallel(hook1, x => x);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
runParallel(hook1, x => x, 7);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
serialize({
    only: 'updatedAt',
    computed: {
        commentsCount: (recommendation, hook) => recommendation.post.commentsInfo.length,
    },
    post: {
        exclude: ['id', 'createdAt', 'author', 'readers'],
        authorItem: {
            exclude: ['id', 'password', 'age'],
            computed: {
                isUnder18: (authorItem, hook) => authorItem.age < 18,
            },
        },
        readersInfo: {
            exclude: 'id',
        },
        commentsInfo: {
            only: ['title', 'content'],
            exclude: 'content',
        },
    },
});

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
setNow('createdAt', 'updatedAt');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
setSlug('storeId');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
sequelizeConvert({
    aBool: 'boolean',
    aDate: 'date',
    anObject: 'json',
    aNumber: 'strToInt'
}, null, {
        strToInt: {
            js: (sqlValue: string) => +sqlValue,
            sql: (jsValue: number) => `${jsValue}`,
        }
    });

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
sifter(ctx => item => true);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
stashBefore();
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
stashBefore('abc');

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
traverse(function(node) {
    if (typeof node === 'string') {
        this.update(node.trim());
    }
});
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
traverse(function(node) {
    if (typeof node === 'string') {
        this.update(node.trim());
    }
}, context => context.params.query);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
validate(async (data, context) => {
    return { length: 'expected max 3, got 7' };
});

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
validateSchema({}, ajv);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
iffElse(syncTrue, [hook1, hook2], [hook3, hook4]);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
iffElse(asyncTrue, [hook1, hook2], [hook3, hook4]);

// $ExpectType IffHook
iff(syncTrue, hook1, hook2);
// $ExpectType IffHook
iff(asyncTrue, hook1, hook2);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
iff(syncTrue, hook1, hook2).else(hook3, hook4);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
iff(asyncTrue, hook1, hook2).else(hook3, hook4);

// $ExpectType IffHook
when(syncTrue, hook1, hook2);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
when(syncTrue, hook1, hook2).else(hook3, hook4);

// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
unless(asyncTrue, hook1, hook2);
// $ExpectType Hook<Application<any, any>, Service<any, any>> || LegacyHookFunction<Application<any, any>, Service<any, any>>
unless(syncTrue, hook1, hook2);

some(asyncFalse, asyncTrue, syncTrue);
every(asyncTrue, syncTrue);
isNot(asyncTrue);
isNot(syncTrue);
