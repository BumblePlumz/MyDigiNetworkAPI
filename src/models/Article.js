import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';

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
}, { sequelize, modelName: 'Article' }
)
