import { Room } from "../models/Room.js";
import { RoomError } from "../classes/RoomError.js";

export const createRoom = async (userID, name) => {
  try {
    await Room.create({
      name: name,
      ownerID: userID,
    });
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const getRooms = async (userID) => {
  try {
    console.log("userID", userID);
    const rooms = await Room.findAll({
      where: { ownerID: userID },
    });
    return rooms;
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const getRoomWithMessages = async (roomID) => {
  try {
    const room = await Room.findOne({ where: { id: roomID } });
    if (!room) throw new RoomError(404, "Room not found");
    return await Room.findOne({
      where: { id: roomID },
      include: {
        all: true,
        nested: true,
      },
    });
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const patchRoomName = async (userID, roomID, name) => {
  try {
    if (!(await Room.findOne({ where: { id } })))
      throw new RoomError(404, "Room not found");
    return await Room.update({ name }, { where: { id } });
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};

export const deleteRoom = async (id) => {
  try {
    if (!(await Room.findOne({ where: { id } })))
      throw new RoomError(404, "Room not found");
    await Room.destroy({ where: { id } });
  } catch (e) {
    throw new RoomError(e.code ?? 500, e.message);
  }
};
