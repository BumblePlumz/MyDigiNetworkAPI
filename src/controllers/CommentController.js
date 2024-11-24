import { Comment } from "../models/Comment.js";
import { CommentError } from "../classes/CommentError.js";
import { Article } from "../models/Article.js";
import { isSubscribedTo, isAuthor, updateTime } from "../utils.js";

export const postComment = async (userID, articleID, content) => {
    try {
        const article = await Article.findByPk(articleID);
        if (!article) throw new CommentError(404, "Article not found");
        const isSubscribed = await isSubscribedTo(userID, article.authorID);

        if (!isAuthor(article.authorID, userID) && !isSubscribed) throw new CommentError(403, "Unauthorized to comment");
        await article.createComment({
            authorID: userID,
            content: content
        });
    } catch (e) {
        throw new CommentError(e.code || 500, e.message);
    }
};

export const updateComment = async (userID, commentID, content) => {
    try {
        const comment = await Comment.findByPk(commentID);
        if (!comment) throw new CommentError(404, "Comment not found");
        if (!isAuthor(comment.authorID, userID)) throw new CommentError(403, "Unauthorized to update comment");
        comment.content = content ?? comment.content;
        updateTime(comment);
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
        if (!isAuthor(comment.authorID, userID)) throw new CommentError(403, "Unauthorized to delete comment");
        await comment.destroy();
    } catch (e) {
        throw new CommentError(e.code, e.message);
    }
};

