import { DataTypes } from "sequelize";
import sequelize from "../configs/db";

export const BlacklistedTokens = sequelize.define("blacklisted_tokens", {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  