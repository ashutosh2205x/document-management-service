import sequelize from "../../../src/configs/db";
import { DataTypes } from "sequelize";

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

export const BlacklistedTokens = sequelize.define("blacklisted_tokens", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
