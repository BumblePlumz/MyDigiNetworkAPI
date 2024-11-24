import { Router } from "express";
import { asyncHandler } from "../AsyncHandler.js";
import {
  getArticle,
  getArticles,
  getMyArticles,
  getSubscribedArticles,
  createArticle,
  deleteArticle,
  updateArticle,
} from "../controllers/ArticleController.js";

const articleRouter = Router();

articleRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const articles = await getArticles(userID);
    res.status(200).json(articles);
  })
);

articleRouter.get(
  "/one/:id",
  asyncHandler(async (req, res) => {
    const articleID = req.params.id;
    const article = await getArticle(articleID);
    res.status(200).json(article);
  })
);

articleRouter.get(
  '/me',
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const articles = await getMyArticles(userID);
    res.status(200).json(articles);
  })
)

articleRouter.get(
  "/subscribed",
  asyncHandler(async (req, res) => {
    const id = req.user.dataValues.id;
    const articles = await getSubscribedArticles(id);
    res.status(200).json(articles);
  })
);

articleRouter.get(
  '/subscribedAndMe',
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const articles = await getSubscribedArticles(userID);
    const myArticles = await getMyArticles(userID);
    res.status(200).json([...articles, ...myArticles]);
  })
)

articleRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const authorID = req.user.dataValues.id;
    const title = req.body.title;
    const content = req.body.content;
    await createArticle(
      authorID,
      title,
      content,
    );
    res.status(201).json();
  })
);

articleRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const articleID = req.params.id;
    const { title, content } = req.body;
    const article = await updateArticle(userID, articleID, title, content);
    res.status(200).json(article);
  })
);

articleRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const articleID = req.params.id;
    await deleteArticle(userID, articleID);
    res.status(204).end();
  })
);

export default articleRouter;
