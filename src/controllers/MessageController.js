import { Message } from '../models/Message.js';
import { MessageError } from '../classes/MessageError.js';
import { isAuthor } from '../utils.js';

export const postMessage = async (authorID, roomID, content) => {
    try {
        if (!authorID || !roomID || !content) throw new MessageError(400, 'Missing parameters');
        await Message.create({ authorID, roomID, content });
    } catch (e) {
        throw new Error(e);
    }
};

export const patchMessage = async (id, content) => {
    try {
        const message = await Message.findOne({ where: { id } });
        if (!message) throw new MessageError(404, 'Message not found');
        if (!isAuthor(message.authorID, userID)) throw new MessageError(403, 'Unauthorized to update message');
        updateTime(message);
        await Message.update({ content }, { where: { id } });
        return message;
    } catch (e) {
        throw new MessageError(e.code ?? 500, e.message);
    }
};

export const deleteMessage = async (userID, id) => {
    try {
        const message = await Message.findOne({ where: { id } });
        if (!message) throw new MessageError(404, 'Message not found');
        if (!isAuthor(message.authorID, userID)) throw new MessageError(403, 'Unauthorized to delete message');
        await Message.destroy({ where: { id } });
    } catch (e) {
        throw new MessageError(e.code ?? 500, e.message);
    }
};