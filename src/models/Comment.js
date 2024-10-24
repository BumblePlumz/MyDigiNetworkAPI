import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';
import { User } from './User.js';
import { Article } from './Article.js';

export class Comment extends Model {}
Comment.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    articleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Article,
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
}, { sequelize, modelName: 'Comments' }
)
