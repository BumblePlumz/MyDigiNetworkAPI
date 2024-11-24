import { Router } from "express";
import { asyncHandler } from "../AsyncHandler.js";
import { postComment, updateComment, deleteComment } from "../controllers/CommentController.js";

const commentRouter = Router();

commentRouter.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const articleID = req.params.id;
    const { content } = req.body;
    await postComment(userID, articleID, content);
    res.status(201).json();
  })
);

commentRouter.put("/:id", asyncHandler(async (req, res) => {
  const userID = req.user.dataValues.id;
  const commentID = req.params.id;
  const { content } = req.body;
  const comment = await updateComment(userID, commentID, content);
  res.status(200).json(comment);
}));

commentRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const commentID = req.params.id;
    await deleteComment(userID, commentID);
    res.status(204).end();
  })
);

export default commentRouter;
