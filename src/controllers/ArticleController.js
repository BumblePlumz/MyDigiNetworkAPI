import { ArticleError } from "../classes/ArticleError.js";
import { Article } from "../models/Article.js";
import { Comment } from "../models/Comment.js";
import { IDsOfSubscriptions, isArticleAuthor } from "../utils.js";

export const getArticles = async (userID) => {
  try {
    const articles = await Article.findAll({
      where: { authorID: userID },
      include: [{
        model: Comment,
        as: 'comments'
      }]
    });

    return articles;
  } catch (e) {
    throw new ArticleError(e.code || 500, e.message);
  }
};

export const getSubscribedArticles = async (userID) => {
  try {
    const articles = [];
    const subscribeTo = await IDsOfSubscriptions(userID);
    for(const authorID of subscribeTo) {
      const article = await Article.findAll({
        where: { authorID: authorID },
        include: [{model: Comment, as: 'comments'}]
      });
      articles.push(...article);
    }

    return articles;
  } catch (e) {
    throw new ArticleError(e.code || 500, e.message);
  }
};

export const createArticle = async (userID, newTitle, newContent) => {
  try {
    await Article.create({
      authorID: userID,
      title: newTitle,
      content: newContent,
    });
  } catch (e) {
    throw new ArticleError(e.code || 500, e.message);
  }
};

export const updateArticle = async (userID, id, title, content) => {
  try {
    const article = await Article.findByPk(id);
    if (!article) throw new ArticleError(404, "Article not found");
    if (!isArticleAuthor(article.authorID, userID)) throw new ArticleError(403, "Unauthorized to update article");

    await article.update({
      title: title ?? article.title,
      content: content ?? article.content,
    });

    return article;
  } catch (e) {
    throw new ArticleError(e.code || 500, e.message);
  }
};

export const deleteArticle = async (userID, id) => {
  try {
    const article = await Article.findByPk(id);
    if (!article) throw new ArticleError(404, "Article not found");
    if (!isArticleAuthor(article.authorID, userID)) throw new ArticleError(403, "Unauthorized to delete article");

    await article.destroy();
  } catch (e) {
    throw new ArticleError(e.code || 500, e.message);
  }
};
