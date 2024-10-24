import { Router } from "express";
import { asyncHandler } from "./AsyncHandler.js";
import {
  createRoom,
  patchRoomName,
  deleteRoom,
  getRooms,
} from "../controllers/RoomController.js";

const roomRouter = Router();

roomRouter.get(
  "/",
  asyncHandler(async (req, res, next) => {
    try {
      const userID = req.user.dataValues.id;
      const rooms = await getRooms(userID);
      res.status(200).json({ rooms });
    } catch (e) {
      next(e);
    }
  })
);

roomRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    try {
      const userID = req.user.dataValues.id;
      const { name } = req.body;
      await createRoom(userID, name);
      res.status(201).json();
    } catch (e) {
      res.status(e.code ?? 500).json({ message: e.message });
    }
  })
);

roomRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const userID = req.user.dataValues.id;
      const roomID = req.params.id;
      const { name } = req.body;
      const room = await patchRoomName(userID, roomID, name);
      res.status(200).json({ room });
    } catch (e) {
      res.status(e.code ?? 500).json({ message: e.message });
    }
  })
);

roomRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    try {
      const userID = req.user.dataValues.id;
      const roomID = req.params.id;
      await deleteRoom(userID, roomID);
      res.status(200).json();
    } catch (e) {
      res.status(e.code ?? 500).json({ message: e.message });
    }
  })
);

export default roomRouter;
