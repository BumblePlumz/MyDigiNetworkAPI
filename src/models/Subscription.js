import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';
import { User } from './User.js';

export class Subscription extends Model {}
Subscription.init({
    ownerID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    targetID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, { sequelize, modelName: 'Subscription' }
);