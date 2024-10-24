import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';
import { User } from './User.js';

export class Article extends Model {}
Article.init({
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    authorID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
}, { sequelize, modelName: 'Article' }
)
