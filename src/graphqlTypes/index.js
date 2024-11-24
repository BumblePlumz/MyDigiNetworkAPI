import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { ArticleType } from './articlesType.js';
import { CommentType } from './commentsType.js';
import { postComment, updateComment, deleteComment } from '../controllers/CommentController.js';
import { createArticle, updateArticle, deleteArticle, getArticles, getMyArticles, getSubscribedArticles } from '../controllers/ArticleController.js';
import { asyncHandler } from '../AsyncHandler.js';

// Root Query
export const rootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        articles: {
            type: new GraphQLList(ArticleType),
            resolve: asyncHandler(async () => {
                return await getArticles();
            }),
        },
        myArticles: {
            type: new GraphQLList(ArticleType),
            args: {
                userID: { type: GraphQLInt },
            },
            resolve: asyncHandler(async (parent, args) => {
                return await getMyArticles(args.userID);
            }),
        },
        subscribedArticles: {
            type: new GraphQLList(ArticleType),
            args: {
                userID: { type: GraphQLInt },
            },
            resolve: asyncHandler(async (parent, args) => {
                return await getSubscribedArticles(args.userID);
            }),
        },
    }),
});

// Root Mutation
export const rootMutation = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        createArticle: {
            type: ArticleType,
            args: {
                userID: { type: GraphQLInt },
                title: { type: GraphQLString },
                content: { type: GraphQLString },
            },
            resolve: asyncHandler(async (parent, args) => {
                return await createArticle(args.userID, args.title, args.content);
            }),
        },
        updateArticle: {
            type: ArticleType,
            args: {
                userID: { type: GraphQLInt },
                id: { type: GraphQLInt },
                title: { type: GraphQLString },
                content: { type: GraphQLString },
            },
            resolve: asyncHandler(async (parent, args) => {
                return await updateArticle(args.userID, args.id, args.title, args.content);
            }),
        },
        deleteArticle: {
            type: ArticleType,
            args: {
                userID: { type: GraphQLInt },
                id: { type: GraphQLInt },
            },
            resolve: asyncHandler(async (parent, args) => {
                return await deleteArticle(args.userID, args.id);
            }),
        },
        postComment: {
            type: CommentType,
            args: {
                content: { type: GraphQLString },
                articleId: { type: GraphQLInt },
            },
            resolve: asyncHandler(async (parent, args) => {
                postComment(args.content, args.articleId)
            }),
        },
        updateComment: {
            type: CommentType,
            args: {
                id: { type: GraphQLInt },
                content: { type: GraphQLString },
            },
            resolve: asyncHandler(async (parent, args) => {
                updateComment(args.id, args.content)
            }),
        },
        deleteComment: {
            type: CommentType,
            args: { id: { type: GraphQLInt } },
            resolve: asyncHandler(async (parent, args) => {
                deleteComment(args.id)
            }),
        },
    }),
});
