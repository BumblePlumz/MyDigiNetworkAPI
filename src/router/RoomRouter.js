import { Router } from "express";
import { asyncHandler } from "../AsyncHandler.js";
import {
  createRoom,
  patchRoomName,
  deleteRoom,
  getRooms,
  addUserToRoom,
  getRoomByName,
} from "../controllers/RoomController.js";

const roomRouter = Router();

roomRouter.get("/", asyncHandler(async (req, res) => {
  const userID = req.user.dataValues.id;
  const rooms = await getRooms(userID);
  res.status(200).json({ rooms });
}));

roomRouter.get('/:name', asyncHandler(async (req, res) => {
  const roomName = req.params.name;
  const room = await getRoomByName(roomName);
  res.status(200).json({ room });
}));

roomRouter.post("/", asyncHandler(async (req, res) => {
  const userID = req.user.dataValues.id;
  const { name } = req.body;
  await createRoom(userID, name);
  res.status(201).json();
}));

roomRouter.post('/add/:name', asyncHandler(async (req, res) => {
  const userID = req.user.dataValues.id;
  const roomName = req.params.name;
  const { friendID } = req.body;
  await addUserToRoom(userID, friendID, roomName);
  res.status(201).json();
}));

roomRouter.patch("/:id", asyncHandler(async (req, res) => {
  const userID = req.user.dataValues.id;
  const roomID = req.params.id;
  const { name } = req.body;
  const room = await patchRoomName(userID, roomID, name);
  res.status(200).json(room);
}));

roomRouter.delete("/:id", asyncHandler(async (req, res) => {
  const userID = req.user.dataValues.id;
  const roomID = req.params.id;
  await deleteRoom(userID, roomID);
  res.status(200).json();
}));

export default roomRouter;
