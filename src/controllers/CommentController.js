import { Comment } from "../models/Comment.js";
import { CommentError } from "../classes/CommentError.js";
import { Article } from "../models/Article.js";
import { isArticleAuthor, isSubscribedTo, isCommentAuthor } from "../utils.js";

export const postComment = async (articleID, userID, content) => {
    try {
        const article = await Article.findByPk(articleID);
        if (!article) throw new CommentError(404, "Article not found");

        const isAuthor = isArticleAuthor(article.authorID, userID);
        const isSubscribed = await isSubscribedTo(userID, article.authorID);

        if (!isAuthor && !isSubscribed) throw new CommentError(403, "Unauthorized to comment");

        await Comment.create({
            articleID: articleID,
            userID: userID,
            content: content
        });
    } catch (e) {
        throw new CommentError(e.code || 500, e.message);
    }
};

export const updateComment = async (userID, id, content) => {
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) throw new CommentError(404, "Comment not found");
        if (!isCommentAuthor(comment.userID, userID)) throw new CommentError(403, "Unauthorized to update comment");
        comment.content = content ?? comment.content;
        await comment.save();
        return comment;
    } catch (e) {
        throw new CommentError(e.code || 500, e.message);
    }
};

export const deleteComment = async (userID, id) => {
    try {
        const comment = await Comment.findByPk(id);
        if (!comment) throw new CommentError(404, "Comment not found");
        if (!isCommentAuthor(comment.userID, userID)) throw new CommentError(403, "Unauthorized to delete comment");
        await comment.destroy();
    } catch (e) {
        throw new CommentError(e.code, e.message);
    }
};

