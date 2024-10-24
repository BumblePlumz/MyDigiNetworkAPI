import { Model, DataTypes } from "sequelize";
import { sequelize } from "../data/index.js";
import { User } from "./User.js";

export class Room extends Model {}

Room.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Rooms",
  }
);
