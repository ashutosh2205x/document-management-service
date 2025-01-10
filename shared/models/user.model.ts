import { DataTypes } from "sequelize";
import sequelize from "../configs/db";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("admin", "editor", "viewer"),
    defaultValue: "viewer",
  },
  permissions: {
    type: DataTypes.ENUM("create, read, update, delete"),
    defaultValue: "read",
  },
});
