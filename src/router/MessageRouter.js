import { Router } from "express";
import { asyncHandler } from "../AsyncHandler.js";
import {
  postMessage,
  patchMessage,
  deleteMessage,
} from "../controllers/MessageController.js";

const messageRouter = Router();

messageRouter.post(
  "/:id",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const roomID = req.params.id;
    const { content } = req.body;
    await postMessage(userID, roomID, content);
    res.status(201).json();
  })
);

messageRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const messageID = req.params.id;
    const { content } = req.body;
    await patchMessage(messageID, content);
    res.status(200).json();
  })
);

messageRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const userID = req.user.dataValues.id;
    const messageID = req.params.id;
    await deleteMessage(userID, messageID);
    res.status(200).json();
  })
);

export default messageRouter;
