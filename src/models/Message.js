import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';

export class Message extends Model {}

Message.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize, modelName: 'Messages' }
)
