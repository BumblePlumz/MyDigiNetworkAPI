import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../data/index.js';

export class Comment extends Model { }
Comment.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { sequelize, modelName: 'Comment' }
  );