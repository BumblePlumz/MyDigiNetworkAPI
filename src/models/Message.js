import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';
import { User } from './User.js';
import { Room } from './Room.js';

export class Message extends Model {}

Message.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roomID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Room,
            key: 'id',
        },
    },
    authorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, { sequelize, modelName: 'Messages' }
)
