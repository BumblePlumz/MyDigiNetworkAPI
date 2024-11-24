import { Model, DataTypes } from "sequelize";
import { sequelize } from "../data/index.js";

export class Room extends Model {}

Room.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Rooms",
  }
);
