import { Op } from "sequelize";
import { Room } from "../models/Room.js";
import { Message } from "../models/Message.js";
import { RoomError } from "../classes/RoomError.js";
import { updateTime, isAuthor } from "../utils.js";
import { User } from "../models/User.js";

export const getRoomByName = async (name) => {
  try {
    const room = await Room.findOne({
      where: { name: name.toLowerCase() },
      include: { model: Message, as: 'messages' },
    });
    if (!room) throw new RoomError(404, "Room not found");
    return room;
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const getRooms = async (userID) => {
  try {
    const user = await User.findOne({ where: { id: userID } });
    if (!user) throw new RoomError(401, "Unauthorized");
    const authorRooms = await user.getRooms();
    const userRooms = await user.getUserRooms();
    const roomIDs = userRooms.map(userRoom => userRoom.dataValues.id);
    const associateRooms = await Room.findAll({
      where: {
        id: roomIDs  // Chercher les rooms dont l'ID est dans le tableau roomIDs
      }
    });
    const rooms = [...authorRooms, ...associateRooms];
    const uniqueRooms = rooms.filter((room, index, self) =>
      index === self.findIndex((r) => r.id === room.id)
    );
    return uniqueRooms;
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const createRoom = async (userID, name) => {
  try {
    const user = await User.findOne({ where: { id: userID } });
    if (!user) throw new RoomError(401, "Unauthorized");

    const lowerName = name.toLowerCase();
    const room = await Room.findOne({ where: { name: lowerName } });
    if (room) throw new RoomError(409, "Room already exists");

    const newRoom = await user.createRoom({ name: lowerName });
    // const newRoom = await Room.create({
    //   name: lowerName,
    //   ownerID: userID,
    // });
    // newRoom.addUser(userID);
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const addUserToRoom = async (userID, friendID, roomName) => {
  try {
    const room = await Room.findOne({ where: { name: roomName.toLowerCase() } });
    if (!room) throw new RoomError(404, "Room not found");
    if (!isAuthor(userID, room.ownerID)) throw new RoomError(403, "Unauthorized to add user to room");
    await room.addUser(friendID);
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const patchRoomName = async (userID, roomID, name) => {
  try {
    const room = await Room.findOne({ where: { id: roomID } });
    if (!room) throw new RoomError(404, "Room not found");
    if (!isAuthor(room.ownerID, userID)) throw new RoomError(403, "Unauthorized to update room");
    updateTime(room);
    room.update({ name }, { where: { id: roomID, ownerID: userID } });

    return room;
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const deleteRoom = async (userID, id) => {
  try {
    const room = await Room.findOne({ where: { id } });
    if (!room) throw new RoomError(404, "Room not found");
    if (!isAuthor(userID, room.ownerID)) throw new RoomError(403, "Unauthorized to delete room");
    await Room.destroy({ where: { id } });
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};
