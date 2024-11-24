import { ArticleError } from "../classes/ArticleError.js";
import { Article } from "../models/Article.js";
import { Comment } from "../models/Comment.js";
import { User } from "../models/User.js";
import { Subscription } from "../models/Subscription.js";
import { isAuthor, updateTime } from "../utils.js";

export const getArticle = async (articleID) => {
  try {
    const article = await Article.findByPk(articleID, {
      include: [
        {
          model: Comment, as: 'comments',
          attributes: ['id', 'content', 'createdAt'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'firstname', 'lastname', 'photo']
            }
          ]
        },
        { model: User, as: 'author', attributes: ['id', 'firstname', 'lastname', 'photo'] }]
    });
    if (!article) throw new ArticleError(404, "Article not found");
    return article;
  } catch (e) {
    throw new ArticleError(e.code, e.message);
  }
};

export const getArticles = async () => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: Comment, as: 'comments',
          attributes: ['id', 'content'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'firstname', 'lastname', 'photo']
            }
          ],
          order: [['createdAt', 'DESC']],
        },
        { model: User, as: 'author', attributes: ['id', 'firstname', 'lastname', 'photo'] }]
    });

    return articles;
  } catch (e) {
    throw new ArticleError(e.code, e.message);
  }
};

export const getMyArticles = async (userID) => {
  try {
    const articles = await Article.findAll({
      where: { authorID: userID },
      include: [
        {
          model: Comment, as: 'comments',
          attributes: ['id', 'content'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'firstname', 'lastname', 'photo']
            }
          ],
          order: [['createdAt', 'DESC']],
        },
        { model: User, as: 'author', attributes: ['id', 'firstname', 'lastname', 'photo'] }]
    });

    return articles;
  } catch (e) {
    throw new ArticleError(e.code, e.message);
  }
}

export const getSubscribedArticles = async (userID) => {
  try {
    const articles = [];
    const subscriptions = await Subscription.findAll({ where: { ownerID: userID } });
    const subscribedTo = subscriptions.map((sub) => sub.targetID);
    for (const authorID of subscribedTo) {
      const article = await Article.findAll({
        where: { authorID: authorID },
        include: [
          {
            model: Comment, as: 'comments',
            attributes: ['id', 'content'],
            include: [
              {
                model: User,
                as: 'author',
                attributes: ['id', 'firstname', 'lastname', 'photo']
              }
            ],
            order: [['createdAt', 'DESC']],
          },
          { model: User, as: 'author', attributes: ['id', 'firstname', 'lastname', 'photo'] }]
      });
      articles.push(...article);
    }

    return articles;
  } catch (e) {
    throw new ArticleError(e.code, e.message);
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
    throw new ArticleError(e.code, e.message);
  }
};

export const updateArticle = async (userID, id, title, content) => {
  try {
    const article = await Article.findByPk(id, {
      include: [
        {
          model: Comment, as: 'comments',
          attributes: ['id', 'content'],
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'firstname', 'lastname', 'photo']
            }
          ]
        },
        { model: User, as: 'author', attributes: ['id', 'firstname', 'lastname', 'photo'] }]
    });
    if (!article) throw new ArticleError(404, "Article not found");
    if (!isAuthor(article.authorID, userID)) throw new ArticleError(403, "Unauthorized to update article");
    updateTime(article);
    await article.update({
      title: title ?? article.title,
      content: content ?? article.content,
    });

    return article;
  } catch (e) {
    throw new ArticleError(e.code, e.message);
  }
};

export const deleteArticle = async (userID, id) => {
  try {
    const article = await Article.findByPk(id);
    if (!article) throw new ArticleError(404, "Article not found");
    if (!isAuthor(article.authorID, userID)) throw new ArticleError(403, "Unauthorized to delete article");
    await article.destroy();
  } catch (e) {
    throw new ArticleError(e.code, e.message);
  }
};
