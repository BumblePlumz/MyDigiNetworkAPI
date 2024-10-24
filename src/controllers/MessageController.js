import { Message } from '../models/Message.js';
import { MessageError } from '../classes/MessageError.js';

export const postMessage = async (userID, roomID, content) => {
    try {
        await Message.create({ userID, roomID, content });
    } catch (e) {
        throw new Error(e);
    }
};

export const getMessages = async (roomID) => {
    try {
        const messages = await Message.findAll({ where: { roomID } });
        if (!messages) throw new MessageError(404, 'Messages not found');
        return messages;
    } catch (e) {
        throw new MessageError(e.code ?? 500, e.message);
    }
};

export const patchMessage = async (id, content) => {
    try {
        if (!(await Message.findOne({ where: { id } }))) throw new MessageError(404, 'Message not found');
        await Message.update({ content }, { where: { id } });
    } catch (e) {
        throw new MessageError(e.code ?? 500, e.message);
    }
};

export const deleteMessage = async (id) => {
    try {
        if (!(await Message.findOne({ where: { id } }))) throw new MessageError(404, 'Message not found');
        await Message.destroy({ where: { id } });
    } catch (e) {
        throw new MessageError(e.code ?? 500, e.message);
    }
};