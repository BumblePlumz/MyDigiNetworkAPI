import { GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql";
import { asyncHandler } from "../AsyncHandler.js";
import { UserType } from "./userType.js";

export const CommentType = new GraphQLObjectType({
    name: "Comment",
    fields: () => ({
        id: { type: GraphQLInt },
        content: { type: GraphQLString },
        articleID: { type: GraphQLInt },
        author: { 
            type: UserType,
            resolve: asyncHandler(async (parent) => {
                return await parent.getAuthor();
            }),
         },
    }),
});