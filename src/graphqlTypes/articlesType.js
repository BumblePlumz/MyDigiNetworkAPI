import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { asyncHandler } from "../AsyncHandler.js";
import { CommentType } from "./commentsType.js";
import { UserType } from "./userType.js";

export const ArticleType = new GraphQLObjectType({
    name: "Article",
    fields: () => ({
        id: { type: GraphQLInt },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        comments: {
            type: new GraphQLList(CommentType),
            resolve: asyncHandler(async (parent) => {
                return await parent.getComments();
            }),
        },
        author: {
            type: UserType,
            resolve: asyncHandler(async (parent) => {
                return await parent.getAuthor();
            }),
        },
    }),
});