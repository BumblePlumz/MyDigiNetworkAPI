import bcrypt from 'bcrypt';
import { config as configDotenv } from 'dotenv';
import { Subscription } from './models/Subscription.js';
import fs from 'fs';
import path from 'path';

configDotenv();

const salt = parseInt(process.env.SALT_ROUNDS) ?? 12;

export function asyncCompare(password, compare) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, compare, (e, result) => {
            if (e) return reject(e);
            else return resolve(result);
        });
    });
}

export function asyncCrypt(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, (e, hash) => {
            if (e) return reject(e);
            else return resolve(hash);
        });
    });
}

export const isAuthor = (authorID, modelID) => {
    return authorID === modelID;
};

export const isSubscribedTo = async (userID, authorID) => {
    const subscriptions = await Subscription.findAll({ where: { ownerID: userID } });
    return subscriptions.some((sub) => sub.targetID === authorID);
};

export const saveImageFromBase64 = (base64String) => {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
        throw new Error('Invalid base64 string');
    }

    const mimeType = matches[1];
    const imageData = matches[2];

    const buffer = Buffer.from(imageData, 'base64');

    const fileName = `image_${Date.now()}.png`;
    const filePath = path.join(process.env.FILE_UPLOAD_PATH, fileName);

    if (!fs.existsSync(process.env.FILE_UPLOAD_PATH)) {
        fs.mkdirSync(process.env.FILE_UPLOAD_PATH, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);
    return { mimeType, filePath };
};

export function updateTime(object) {
    if (object.changed()) {
        object.updatedAt = new Date();
    }
}